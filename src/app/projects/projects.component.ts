import { Component, OnInit } from '@angular/core';
import projects from '../../projects/projects.json';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  public projects: {
    title: string,
    client?: string,
    client_url?: string,
    demo_url?: string,
    description: string,
    technologies: string[],
    small_preview?: string
  }[] = projects;
  constructor() { }

  ngOnInit(): void {
    console.log(this.projects);
  }

}
