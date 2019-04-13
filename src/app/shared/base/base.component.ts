import { LoadingProvider } from './../../providers/loading/loading.provider';

export class BaseComponent {
  constructor(protected loadingProvider: LoadingProvider) { }

  showLoader() {
    this.loadingProvider.isLoading.next(true);
  }

  hideLoader() {
    this.loadingProvider.isLoading.next(false);
  }
}
