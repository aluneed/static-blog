import { Injectable } from '@angular/core';
import { contentIndex } from './content-index';
import { ContentMeta } from './ContentMeta';
import { Tag, tags } from './tags';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  
  contentList: ContentMeta[] = contentIndex.reverse()
    .map(e => {
      return { id: Number(e.id), title: e.title, date: e.date, tags: e.tags.replace(" ","").split(","), category: e.category, type: e.type, path: e.path };
    });
  tagsSelected: Map<string, boolean> = new Map();  //todo: tags reverse index
  filteredContentList: ContentMeta[] = this.contentList;

  indexBuffer: ContentMeta[] = [];  //todo: rxjs subscribe
  pageIndexList: string[] = [];

  pageSize = 10;
  pageNum = 1;

  pageCount = 1;
  
  constructor() {
    this.pageCount = Math.ceil(this.contentList.length / this.pageSize);
    
    // tags.forEach(tag => this.tagsSelected.set(tag.name, false));
    let tagsSelectedJsonString = sessionStorage.getItem("tagsSelected");
    if (tagsSelectedJsonString == null || tagsSelectedJsonString == "{}") {
      tags.forEach(tag => this.tagsSelected.set(tag.name, false));
    } else {
      tagsSelectedJsonString.split(",").forEach(tupleString => {
        let tuple: string[] = tupleString.split(":");
        this.tagsSelected.set(tuple[0], tuple[1] == "true");
      })
    }
    this.updateFilteredContentList();
    let currentPage = sessionStorage.getItem("currentPage");
    this.setCurrentPage(currentPage == null ? 1 : Number(currentPage));

    window.onbeforeunload = () => {
      this.saveTagsSession();
    }
  }

  jumpPage(page: String) {
    if (page == "<<") {
      this.setCurrentPage(1);
    } else if (page == "<") {
      this.setCurrentPage(this.getCurrentPage() - 1);
    } else if (page == ">") {
      this.setCurrentPage(this.getCurrentPage() + 1);
    } else if (page == ">>") {
      this.setCurrentPage(this.pageCount);
    } else {
      this.setCurrentPage(Number(page));
    }
  }

  getCurrentPage(): number {
    return Number(sessionStorage.getItem("currentPage"));
  }

  setCurrentPage(pageNum: number): void {
    sessionStorage.setItem("currentPage", pageNum.toString());
    this.pageIndexList.splice(0, this.pageIndexList.length);  //pageIndexList?????????????????????, ??????????????????slice, ??????????????????????????????????????????
    let min = Math.max(pageNum - 5, 1);
    let max = Math.min(pageNum + 5, this.pageCount);
    if (pageNum > 1) {
      this.pageIndexList.push("<<");
      this.pageIndexList.push("<");
    }
    for (let i = min; i <= max; i++) {
      this.pageIndexList.push(i.toString());
    }
    if (pageNum < this.pageCount) {
      this.pageIndexList.push(">");
      this.pageIndexList.push(">>");
    }

    let pageResult = this.getPageContentList(pageNum, this.pageSize);
    for (let i = 0; i < pageResult.length; i++) {
      this.indexBuffer[i] = pageResult[i];
    }
    let length = this.indexBuffer.length;
    for (let i = pageResult.length; i < length; i++) {
      this.indexBuffer.pop();
    }
  }

  selectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, true);
    this.updateFilteredContentList();
  }

  deselectTag(tag: Tag): void {
    this.tagsSelected.set(tag.name, false);
    
    //or filter ????????????????????????????????????????????????
    // let tagCount = Array.from(this.tagsSelected.values()).filter(value => value).length;
    // if(tagCount == 0) {
      // this.clearTagsFilter();
    // } else {
      this.updateFilteredContentList();
    // }
  }

  updateFilteredContentList(): void {

    let selectedTagList: string[] = Array.from(this.tagsSelected.entries())
      .filter(entry => entry[1] == true)
      .map(entry => entry[0])

    this.filteredContentList = this.contentList
      // or
      // .filter(content => content.tags.some(tag => this.tagsSelected.get(tag) == true));  //?????????????????????????????????; ?????????????????????????????????????
      // and
      .filter(content => 
        selectedTagList
          .every(selectedTag => content.tags.some(contentTag => contentTag == selectedTag))
      )
    this.pageCount = Math.ceil(this.filteredContentList.length / this.pageSize);
    this.setCurrentPage(1);
  }

  clearTagsFilter(): void {
    this.tagsSelected.forEach((value, key) => this.tagsSelected.set(key, false));
    this.filteredContentList = this.contentList;
    this.pageCount = Math.ceil(this.filteredContentList.length / this.pageSize);
    this.setCurrentPage(1);
  }

  saveTagsSession(): void {
    let tagsSelectedString = Array.from(this.tagsSelected.entries())
      .reduce((accumulated, entry) => {
        return accumulated + entry[0] + ":" + entry[1] + ",";
      }, "");
    sessionStorage.setItem("tagsSelected", tagsSelectedString.substring(0, tagsSelectedString.length - 1));
  }

  getPageContentList(pageNum: number, pageSize: number): ContentMeta[] {
    const start = (pageNum - 1) * pageSize;
    const end = Math.min(start + pageSize, this.filteredContentList.length);
    return this.filteredContentList.slice(start, end);
  }

}
