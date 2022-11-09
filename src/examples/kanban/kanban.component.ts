import { Component } from "@angular/core";

import { MeshBasicMaterial } from "three";
import { ListItem , GlobalFlatUITheme, InteractiveObjects } from "ng3-flat-ui";


export type TaskStatus = 'Open' | 'Progress' | 'Review' | 'Closed';

export class KanbanTaskType {
  material!: MeshBasicMaterial;
  constructor(public name: string, public icon: string, public color: string) {
    this.material = new MeshBasicMaterial({ color: color })
  }
}

export class KanbanOwner {
  material!: MeshBasicMaterial;
  constructor(public name: string, public initials: string, public color?: string, public avatarurl?: string) {
    if (color)
      this.material = new MeshBasicMaterial({ color: color })
    else
      this.material = GlobalFlatUITheme.ButtonMaterial as MeshBasicMaterial;
  }
}

export class KanbanTask {
  constructor(
    public id: number,
    public type: KanbanTaskType,
    public title: string,
    public owner: KanbanOwner,
    public description = '',
    public status: TaskStatus = 'Open',
    public tags: Array<string> = [],
  ) { }
}


export class KanbanColumn {
  constructor(
    public headertext: string,
    public headericon: string,
    public status: TaskStatus, // key value in task state for filtering on this column
    public showcollapse = false, // show collapse button
    public width = 1) // display width of column
  { }
}

@Component({
  templateUrl: './kanban.component.html',
})
export class KanbanExample {
  selectable = new InteractiveObjects();

  listheight = 2;
  listmargin = 0.02;
  cardheight = 0.6;

  private task = new KanbanTaskType('Task', 'task', 'gold')
  private bug = new KanbanTaskType('Bug', 'bug_report', 'red')
  private story = new KanbanTaskType('Story', 'auto_stories', 'cornflowerblue')

  private fry = new KanbanOwner('Fry', 'PF', 'orange')
  private amy = new KanbanOwner('Amy', 'AW', 'black')
  private zoidberg = new KanbanOwner('Zoidberg', 'DZ', 'salmon')
  private bender = new KanbanOwner('Bender', 'BR', '#666')

  columns: Array<KanbanColumn> = [
    new KanbanColumn('To Do', 'add_box', 'Open'),
    new KanbanColumn('In Progress', 'more_horiz', 'Progress'),
    new KanbanColumn('In Review', 'reviews', 'Review'),
    new KanbanColumn('Done', 'done', 'Closed'),
  ]

  tasks: Array<KanbanTask> = [
    new KanbanTask(1, this.task, 'Kill All Humans', this.bender, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry', 'Open', ['one', 'two', 'breaking issue']),
    new KanbanTask(2, this.bug, 'Feed the Owls', this.fry),
    new KanbanTask(3, this.story, 'Travel to Mars', this.amy),
    new KanbanTask(4, this.task, 'Cleanup Dumpster', this.zoidberg),
  ]

  getTasks(status: TaskStatus): Array<ListItem> {
    return this.tasks.filter(item => item.status == status).map((x) => { return { text: x.title, data: x } })
  }
}
