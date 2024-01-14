import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Auth } from 'aws-amplify';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
Auth.configure({

  region: 'ap-southeast-2',
  userPoolId: environment.userPoolId,
  userPoolWebClientId: environment.userPoolClientId,

});
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
