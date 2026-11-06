import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { time as echartTime } from 'echarts/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import type { EChartsCoreOption } from 'echarts/core';
import * as echarts from 'echarts';
import { TodoClient } from '../todo-client';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  imports: [NgxEchartsDirective],
  selector: 'app-dashboard',
  providers: [provideEchartsCore({ echarts })],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  brkPntService = inject(BreakpointObserver);
  smallScreen = signal(false);
  todoService = inject(TodoClient);
  apiData = signal<[string, number][]>([]);
  currentYear = signal<Date>(new Date());
  breakpointSubscription: Subscription | undefined;

  heatOptions = computed<EChartsCoreOption>(() => ({
    title: {
      top: 30,
      left: 'center',
      text: 'Created Todos ' + this.currentYear().getFullYear(),
    },
    tooltip: {},
    visualMap: {
      // min: 0,
      // min: 1,
      // max: 1,
      pieces: [
        // { value: 0, label: '0' },
        { gte: 1, label: '1 or more', color: '#5070DD' },
        // { min: 1, label: '1 or more', color:'#5070DD' },
      ],
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65,
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: this.currentYear().getFullYear(),
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: this.apiData(),
    },
  }));

  ngOnInit(): void {
    this.setResponsiveObservables();
    this.fetchTodosAnalytics();
  }

  setResponsiveObservables(): void {
    this.breakpointSubscription = this.brkPntService.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.TabletPortrait
    ]).subscribe(result => {
      this.smallScreen.set(false);
      if (result.matches) {
        this.smallScreen.set(true);
      }
    });
  }

  fetchTodosAnalytics(): void {
    this.todoService.getTodosAnalytics().subscribe({
      next: (res: any) => {
        const todos = res.data.data;
        const todosPerDayCount: Record<string, number> = {};
        todos.forEach((todo: any) => {
          todo.createdAt = new Date(todo.created_at);
          delete todo.created_at;
          if (todosPerDayCount[todo.createdAt.toDateString()]) {
            todosPerDayCount[todo.createdAt.toDateString()]++;
          } else {
            todosPerDayCount[todo.createdAt.toDateString()] = 1;
          }
        });
        const parsedData: [string, number][] = [];
        for (const [date, count] of Object.entries(todosPerDayCount)) {
          const helperDate = new Date(date);
          let checkedCount = 0;
          if (typeof count === 'number') {
            checkedCount = count;
          }
          parsedData.push([echartTime.format(helperDate.getTime(), '{yyyy}-{MM}-{dd}', false), checkedCount])
        }
        this.apiData.set(parsedData);
      }
    });
  }
}
