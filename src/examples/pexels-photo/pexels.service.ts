import { Injectable } from "@angular/core";

import { createClient, ErrorResponse, PaginationParams, Photo, Photos, PhotosWithTotalResults } from 'pexels';

export type PexelOrientation = 'landscape' | 'portrait' | 'square';

@Injectable()
export class PexelsService {

  private client!: any;

  connect(apikey: string) {
    this.client = createClient(apikey);
  }

  searchPhotos(params: PaginationParams): Promise<PhotosWithTotalResults> {
    return this.client.photos.search(params);
  }
  curatedPhotos(params?: PaginationParams): Promise<Photos> {
    return this.client.photos.curated(params)
  }

  showPhoto(id: string | number): Promise<Photo> {
    return this.client.photos.show(id);
  }

  randomPhoto(): Promise<Photo> {
    return this.client.photos.random();
}
  
}
