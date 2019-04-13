import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GoogleMap, GoogleMaps, GoogleMapsAnimation } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { BookingProvider } from './../../providers/booking/booking.provider';
import { SocketServiceProvider } from './../../providers/socket/socket.provider';
declare const google;


@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})

export class TrackerPage implements OnDestroy {
  public carShare: ICarShare;
  public map: GoogleMap;
  public isHost: boolean;
  public passengerCount: number;

  private locationPoints: any[] = [];
  private directionsService: any;
  private stopsReached = 0;
  private line: any;
  private nextPassengerMarker;

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private socketServiceProvider: SocketServiceProvider,
    private location: Geolocation,
    private bookingProvider: BookingProvider
  ) {
    this.directionsService = new google.maps.DirectionsService();
  }

  private loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });
  }

  private delayCall(fn: Function) {
    setTimeout(() => {
      fn();
    }, 2000);
  }

  private async drawRoute(lat: number, lng: number, final: boolean, destLatLng: any) {
    console.log(this.nextPassengerMarker);
    if (this.nextPassengerMarker) {
      this.nextPassengerMarker.remove();
    }

    console.log(destLatLng);
    const request = {
      origin: lat + ',' + lng,
      destination: final ?
        this.carShare.destination.coordinates[1] + ',' + this.carShare.destination.coordinates[0] :
        destLatLng[1] + ',' + destLatLng[0],
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        const plyPath = [];
        const legs = result.routes[0].legs;
        for (let i = 0; i < legs.length; i++) {
          const steps = legs[i].steps;
          for (let j = 0; j < steps.length; j++) {
            const nextSegment = steps[j].path;
            for (let k = 0; k < nextSegment.length; k++) {
              plyPath.push({
                lat: nextSegment[k].lat(),
                lng: nextSegment[k].lng()
              });
            }
          }
        }

        this.line = this.map.addPolylineSync({
          points: plyPath,
          'color': '#AA00FF',
          'width': 4,
          'geodesic': true
        });

        if (destLatLng) {
          this.nextPassengerMarker = this.map.addMarkerSync({
            position: {
              lat: destLatLng[1],
              lng: destLatLng[0]
            },
            icon: {
              url: 'http://192.168.0.32:8100/assets/marker-icons/user.png',
              size: {
                width: 32,
                height: 32
              }
            },
            animation: GoogleMapsAnimation.BOUNCE
          });
        }
      }
    });
  }

  private handleHostActions() {
    let hostMarker;

    this.socketServiceProvider.emit('start:carShare', {
      carShareId: this.carShare._id
    });

    this.location.watchPosition().subscribe(async (location: Geoposition) => {
      this.socketServiceProvider.emit('location:update', {
        coordinates: {
          type: 'Point',
          coordinates: [location.coords.longitude, location.coords.latitude]
        },
        carShareId: this.carShare._id,
        ownerId: this.carShare.ownerInformation._id
      });

      if (hostMarker) {
        hostMarker.remove();
      }

      this.map.setCameraTarget({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      if (hostMarker) {
        hostMarker.remove();
      }

      hostMarker = await this.map.addMarker({
        position: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        },
        rotation: location.coords.heading,
        icon: {
          url: 'http://192.168.0.32:8100/assets/marker-icons/me.png',
          size: {
            width: 32,
            height: 32
          }
        },
        animation: GoogleMapsAnimation.BOUNCE
      });

      this.drawRoute(location.coords.latitude, location.coords.longitude, false, this.locationPoints[0]);
    });

    this.socketServiceProvider.on('location:reached', () => {
      if (this.stopsReached === this.locationPoints.length) {
        return;
      }

      console.log('Called');
      this.stopsReached++;

      this.location.getCurrentPosition().then((location: Geoposition) => {
        if (this.stopsReached === this.locationPoints.length) {
          console.log('Final destination now');
          if (this.line) {
            this.line.remove();
          }

          this.drawRoute(location.coords.latitude, location.coords.longitude, true, undefined);
        } else {
          console.log('Stops Reached ' + this.stopsReached);
          if (this.line) {
            this.line.remove();
          }
          this.drawRoute(location.coords.latitude, location.coords.longitude, false, this.locationPoints[this.stopsReached]);
        }
      });
    });

    this.bookingProvider.getBookings(this.carShare._id).subscribe((bookings: IBooking[]) => {
      this.passengerCount = bookings.length;

      bookings.forEach(booking => {
        this.locationPoints.push(booking.locationInformation.location.coordinates);
      });
    });
  }

  private handlePassengerActions() {
    let userMarker;
    let hostMarker;

    this.location.watchPosition().subscribe(async (location: Geoposition) => {
      if (userMarker) {
        userMarker.remove();
      }

      this.map.setCameraTarget({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      userMarker = await this.map.addMarker({
        position: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        },
        rotation: location.coords.heading,
        icon: {
          url: 'http://192.168.0.32:8100/assets/marker-icons/me.png',
          size: {
            width: 32,
            height: 32
          }
        },
        animation: GoogleMapsAnimation.BOUNCE
      });
    });

    this.socketServiceProvider.on('host:location', async (data: any) => {
      if (hostMarker) {
        hostMarker.remove();
      }

      hostMarker = await this.map.addMarker({
        position: {
          lat: data.location.coords[1],
          lng: data.location.coords[0]
        },
        icon: {
          url: 'http://192.168.0.32:8100/assets/marker-icons/car.png',
          size: {
            width: 32,
            height: 32
          }
        },
        animation: GoogleMapsAnimation.BOUNCE
      });
    });
  }

  async ionViewWillEnter() {
    // Perform a check both client and server side that the person starting this car share really is the owner

    await this.platform.ready();

    this.loadMap();

    this.activatedRoute.paramMap
      .pipe(
        map(() => window.history.state)
      ).subscribe((data) => {
        if (data && data.carShare) {
          this.carShare = data.carShare;
        }

        if (data && data.isHost) {
          this.isHost = data.isHost;
        }

        this.delayCall(() => {
          if (this.isHost) {
            this.handleHostActions();
          } else {
            this.handlePassengerActions();
          }
        });
      });
  }

  async ngOnDestroy() {
    this.socketServiceProvider.emit('leave:carShare', { carShareId: this.carShare._id });
  }
}
