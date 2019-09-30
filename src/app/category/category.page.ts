import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  public category: any = [];

  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
    autoplay: false
  };
  constructor(private router: Router) { }

  ngOnInit() {
    this.category = [
      {
        'id': 1,
        'slug':'Basic-Theory-Test',
        'name': 'Car Driving - the Basic Theory Test (BTT)',
        'image': 'http://www.basictheorytestsg.com/test_pictures/69c00b986ae281c9_144125.jpg',
        'count': '436'
      },
      {
        'id': 1,
        'slug':'Final-Theory-Test',
        'name': 'Car Driving - the Final Theory Test (FTT)',
        'image': 'http://www.basictheorytestsg.com/test_pictures/2e3433f9d9d22acc_144110.jpg',
        'count': '500'
      },
      {
        'id': 1,
        'slug':'motorcycle-Theory-Test',
        'name': 'Motorcycle Riding - the Theory Test (RTT)',
        'image': 'http://www.basictheorytestsg.com/test_pictures/25662c351c5db417_144043.jpg',
        'count': '200'
      }

    ];
  }

  startTest(category) {
    this.router.navigate(['/questions'], { queryParams: { slug: category } });
  }

}
