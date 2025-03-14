import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    GridModule,
    GridComponent,
    PageSettingsModel,
    DataStateChangeEventArgs,
    PageService,
    SortService,
    FilterService,
    ToolbarService,
    ResizeService
} from '@syncfusion/ej2-angular-grids';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from '@syncfusion/ej2-angular-calendars';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { TextBoxModule } from '@syncfusion/ej2-angular-inputs';
import { DialogModule, Dialog } from '@syncfusion/ej2-angular-popups';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { GridStateService, GridState } from '../../services/grid-state.service.service';

import { LessonService } from '../../services/lesson.service';
import { UserService } from '../../services/user.service';

import { LessonStatus } from '../../models/enums/lesson-status';
import { LessonType } from '../../models/enums/lesson-type';
import { UserRole } from '../../models/enums/user-role';
import { Lesson } from '../../models/lesson';

@Component({
    selector: 'app-lessons',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        GridModule,
        DatePickerModule,
        DropDownListModule,
        TextBoxModule,
        DialogModule,
        ButtonModule
    ],
    providers: [ToolbarService, PageService, SortService, FilterService, ResizeService],
    templateUrl: './lessons.component.html',
    styleUrls: ['./lessons.component.scss']
})
export class LessonsComponent implements OnInit {
    //#region ViewChild References
    @ViewChild('grid') grid!: GridComponent;
    @ViewChild('editDialog') editDialog!: Dialog;
    @ViewChild('deleteDialog') deleteDialog!: Dialog;
    //#endregion

    //#region Public Properties
    // Grid data must follow { result: User[], count: number }
    public gridData: { result: Lesson[]; count: number } = { result: [], count: 0 };
    public pageSettings: PageSettingsModel = { pageSize: 10, pageSizes: [5, 10, 20, 50, 100] };

    // Toolbar: only a custom "Add" button is used.
    public toolbar: string[] = ['Add'];

    // Custom dialog properties for Add/Edit.
    public isEditMode = false; // true for Edit; false for Add.
    public currentRecord: Lesson = {} as Lesson;

    // Delete confirmation: store record to be deleted.
    public selectedRecord: Lesson | null = null;

    // Filtering configuration as a partial of User.
    public searchParams: Partial<Lesson> = {};

    public statusDefault: string = 'All';
    public LessonStatus = LessonStatus;
    //#endregion

    //#region Internal State
    private currentPage = 1;
    private sortField?: keyof Lesson;
    private sortDirection: string = 'Ascending';
    //#endregion


    //#region Constructor & Lifecycle Hooks
    constructor(
        private lessonService: LessonService,
        private userService: UserService,
        private gridStateService: GridStateService) { }


    ngOnInit(): void {
        this.loadData();
    }


    onGridCreated(): void {
        if (this.grid) {
            setTimeout(() => {
                this.grid.pageSettings.pageSize = this.pageSettings.pageSize;
                this.grid.dataBind();
            }, 0);
        }
    }

    public get statusData(): string[] {
        return ['All', ...Object.keys(LessonStatus).filter(key => isNaN(Number(key)))];
      }

    /**
     * Handles grid state changes by delegating to the GridStateService.
     */
    onDataStateChange(state: DataStateChangeEventArgs): void {
        const gridState: GridState<Lesson> = this.gridStateService.updateState<Lesson>(state);
        this.currentPage = gridState.currentPage;
        this.pageSettings.pageSize = gridState.pageSize;
        this.sortField = gridState.sortField;
        this.sortDirection = gridState.sortDirection || 'Ascending';
        this.searchParams = gridState.searchParams;
        this.loadData();
    }

    /**
     * Loads grid data based on current state.
     */
    loadData(): void {
        this.lessonService.getAllLessons(this.currentPage, this.pageSettings.pageSize).subscribe({
            next: (response) => {

                this.gridData = { result: response.lessons.results, count: response.lessons.totalResults }
              console.log("data", this.gridData);
            },
            error: (err) => {
                console.error('Failed to fetch lessons and propositions:', err);
            }
        });
    }
    //#endregion

    //#region Custom Filter Handlers
    onDateFilterChange(args: any, field: string): void {
        if (args.value) {
            this.grid.filterByColumn('date', 'equal', args.value);
        } else {
            this.grid.clearFiltering([field]);
        }
    }

    onStatusFilterChange(args: any, field: string): void {
        if (args.value && args.value !== 'All') {
            this.grid.filterByColumn('status', 'equal', args.value);
        } else {
            this.grid.clearFiltering([field]);
        }
    }
    //#endregion

    //#region Command Column & Toolbar Handlers
    onAddClick(): void {
        this.isEditMode = false;
        this.currentRecord = {} as Lesson;
        this.editDialog.show();
    }

    onEdit(user: Lesson): void {
        this.isEditMode = true;
        this.currentRecord = { ...user };
        this.editDialog.show();
    }

    onDelete(user: Lesson): void {
        this.selectedRecord = user;
        this.deleteDialog.show();
    }

    saveRecord(): void {
        if (this.isEditMode) {
            const index = this.gridData.result.findIndex(item => item.id === this.currentRecord.id);
            if (index > -1) {
                this.gridData.result[index] = this.currentRecord;
            }
        } else {
            this.gridData.result.push(this.currentRecord);
            this.gridData.count++;
        }
        this.editDialog.hide();
        this.grid.refresh();
    }

    cancelRecord(): void {
        this.editDialog.hide();
    }

    confirmDelete(): void {
        if (this.selectedRecord) {
            const index = this.gridData.result.findIndex(item => item.id === this.selectedRecord!.id);
            if (index > -1) {
                this.gridData.result.splice(index, 1);
                this.gridData.count--;
            }
        }
        this.deleteDialog.hide();
        this.grid.refresh();
    }

    cancelDelete(): void {
        this.deleteDialog.hide();
    }
}
