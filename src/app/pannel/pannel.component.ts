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

  tags: Tag[] = tags;

  tagsSelected: Map<string, boolean> = this.pageService.tagsSelected;

  ngOnInit(): void {
  }

  //https://stackoverflow.com/questions/72305225/how-do-i-hide-an-agular-component-on-all-routes-that-correspond-to-a-certain-pat
  public type(): string {
    if (window.location.pathname.startsWith('/blog/')) {
      return "index";
    }
    if (window.location.pathname.endsWith('blog')) {
      return "filter";
    }
    return "default";
  }

  clickTag(tag: Tag): void {
    if(this.tagsSelected.get(tag.name)){
      this.pageService.deselectTag(tag);
    } else {
      this.pageService.selectTag(tag);
    }
    console.log(this.pageService.tagsSelected);
  }

  clearTagsFilter(): void {
    this.pageService.clearTagsFilter();
  }

}
