declare const google;

import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { GoogleMap, GoogleMaps, Marker, Polyline } from '@ionic-native/google-maps';
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { IBooking } from 'src/app/interfaces/IBooking';
import { ICarShare } from 'src/app/interfaces/ICarShare';
import { BookingProvider } from '../../../providers/booking/booking.provider';
import { SocketServiceProvider } from '../../../providers/socket/socket.provider';

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
  public stopsReached: number;
  public mapIsReady: boolean;

  private locationPoints: any[];
  private directionsService: any;
  private route: Polyline;
  private nextPassengerMarker: Marker;
  private currentUserMarkerIcon: string;
  private hostMarkerIcon: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private platform: Platform,
    private socketServiceProvider: SocketServiceProvider,
    private location: Geolocation,
    private bookingProvider: BookingProvider
  ) {
    this.setupDefaultsForClass();
  }

  private setupDefaultsForClass() {
    this.directionsService = new google.maps.DirectionsService();
    this.locationPoints = [];
    this.stopsReached = 0;
    this.passengerCount = 0;
    this.currentUserMarkerIcon = '../../../../assets/marker-icons/me.png';
    this.hostMarkerIcon = '../../../../assets/marker-icons/car.png';
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

  private determineIfNextStopIsDestination(final: boolean, finalDestinationLatLng: number[]) {
    return final
      ? this.carShare.destination.coordinates[1] + ',' + this.carShare.destination.coordinates[0]
      : finalDestinationLatLng[1] + ',' + finalDestinationLatLng[0];
  }

  private drawRoute(lat: number, lng: number, final: boolean, finalDestinationLatLng: number[]) {
    if (this.nextPassengerMarker) {
      this.nextPassengerMarker.remove();
    }

    const request = {
      origin: lat + ',' + lng,
      destination: this.determineIfNextStopIsDestination(final, finalDestinationLatLng),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.setupJourneyRoute(result, finalDestinationLatLng);
      }
    });
  }

  private setupJourneyRoute(result: any, finalDestinationLatLng: number[]) {
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

    this.route = this.map.addPolylineSync({
      points: plyPath,
      color: '#3A405A',
      width: 8,
      geodesic: true
    });

    if (finalDestinationLatLng) {
      this.nextPassengerMarker = this.map.addMarkerSync({
        position: {
          lat: finalDestinationLatLng[1],
          lng: finalDestinationLatLng[0]
        },
        icon: {
          url: '../../../../assets/marker-icons/user.png',
          size: {
            width: 32,
            height: 32
          }
        }
      });
    }
  }

  private startCarShare() {
    this.socketServiceProvider.emit('start:carShare', {
      carShareId: this.carShare._id
    });
  }

  private removeHostMarker(hostMarker: Marker) {
    if (hostMarker) {
      hostMarker.remove();
    }
    if (hostMarker) {
      hostMarker.remove();
    }
  }

  private isFirstRun(firstRun: boolean) {
    return firstRun;
  }

  private allPassengersPickedUp() {
    return this.passengerCount === this.stopsReached;
  }

  private getCurrentPositionAndSetupRoute() {
    this.location.getCurrentPosition().then((location: Geoposition) => {
      if (this.allPassengersPickedUp()) {
        if (this.route) {
          this.route.remove();
        }

        this.drawRoute(location.coords.latitude, location.coords.longitude, true, undefined);
      } else {
        if (this.route) {
          this.route.remove();
        }
        this.drawRoute(location.coords.latitude, location.coords.longitude, false, this.locationPoints[this.stopsReached]);
      }
    });
  }

  private handleHostActions() {
    let hostMarker: Marker;
    let firstRun = false;

    this.startCarShare();

    this.location.watchPosition().subscribe(async (location: Geoposition) => {
      this.socketServiceProvider.emit('location:update', {
        coordinates: {
          type: 'Point',
          coordinates: [location.coords.longitude, location.coords.latitude]
        },
        carShareId: this.carShare._id,
        ownerId: this.carShare.ownerInformation._id
      });

      this.removeHostMarker(hostMarker);

      this.map.setCameraTarget({
        lat: location.coords.latitude,
        lng: location.coords.longitude
      });

      hostMarker = this.map.addMarkerSync({
        position: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        },
        rotation: location.coords.heading,
        icon: {
          url: this.currentUserMarkerIcon,
          size: {
            width: 32,
            height: 32
          }
        }
      });

      if (!this.isFirstRun(firstRun)) {
        this.drawRoute(location.coords.latitude, location.coords.longitude, false, [this.locationPoints[0], this.locationPoints[1]]);
      }

      firstRun = true;
    });

    this.socketServiceProvider.on('location:reached', () => {
      if (this.allPassengersPickedUp()) {
        return;
      }

      this.stopsReached++;

      this.getCurrentPositionAndSetupRoute();
    });

    this.bookingProvider.getBookings(this.carShare._id).subscribe((bookings: IBooking[]) => {
      this.passengerCount = bookings.length;

      bookings.forEach(booking => {
        this.locationPoints.push(booking.locationInformation.location.coordinates);

        this.getCurrentPositionAndSetupRoute();
      });
    });
  }

  private handlePassengerActions() {
    let userMarker: Marker;
    let hostMarker: Marker;

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
          url: this.currentUserMarkerIcon,
          size: {
            width: 32,
            height: 32
          }
        }
      });
    });

    this.socketServiceProvider.on('host:location', async (data: any) => {
      this.removeHostMarker(hostMarker);

      hostMarker = await this.map.addMarker({
        position: {
          lat: data.location.coords[1],
          lng: data.location.coords[0]
        },
        icon: {
          url: this.hostMarkerIcon,
          size: {
            width: 32,
            height: 32
          }
        }
      });
    });
  }

  async ionViewWillEnter() {
    // TODO - Perform a check both client and server side that the person starting this car share really is the owner
    setTimeout(() => {
      this.mapIsReady = true;
    }, 4000);

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


        if (this.isHost) {
          this.handleHostActions();
        } else {
          this.handlePassengerActions();
        }
      });
  }

  ngOnDestroy() {
    this.socketServiceProvider.emit('leave:carShare', { carShareId: this.carShare._id });
  }
}
