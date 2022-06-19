import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageService } from '../page.service';
import { Tag, tags } from '../tags';

@Component({
  selector: 'app-pannel',
  templateUrl: './pannel.component.html',
  styleUrls: ['./pannel.component.css']
})
export class PannelComponent implements OnInit {

  constructor(
    private pageService: PageService,
    private route: ActivatedRoute
  ) { }

  flag: boolean = true;
  type: string = "filter";

  tags: Tag[] = tags;

  tagsSelected: Map<string, boolean> = this.pageService.tagsSelected;

  ngOnInit(): void {
  }

  clickTag(tag: Tag): void {
    if(this.tagsSelected.get(tag.name)){
      this.pageService.deselectTag(tag);
    } else {
      this.pageService.selectTag(tag);
    }
  }

  clearTagsFilter(): void {
    this.pageService.clearTagsFilter();
  }

}
