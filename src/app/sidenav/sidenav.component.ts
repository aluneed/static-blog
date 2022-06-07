import { Component, OnInit } from '@angular/core';

import { SidenavItem, sidenavItemList } from '../sidenav-item'

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  constructor() { }

  sidenavItemList: SidenavItem[] = sidenavItemList;

  ngOnInit(): void {
  }

}
