import { NgModule } from '@angular/core';
import { MovieNamePipe } from './movie-name/movie-name';
@NgModule({
	declarations: [MovieNamePipe],
	imports: [],
	exports: [MovieNamePipe]
})
export class PipesModule {}
