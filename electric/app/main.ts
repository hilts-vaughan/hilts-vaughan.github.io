import {bootstrap} from 'angular2/platform/browser';
import {HTTP_BINDINGS} from 'angular2/http';
import {AppComponent} from './app.component';
import 'rxjs/Rx'

// Common bootstraps for many things
import {NgFor, NgIf} from 'angular2/common'

bootstrap(AppComponent, [HTTP_BINDINGS,]);
