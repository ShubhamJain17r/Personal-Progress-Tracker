import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { DateRange, ReportType, ProgressReport } from '../types';
import { Goal } from '../types/goal';
import { DailyRecord } from '../types/record';
import { Category } from '../types/category';
import { analyticsService } from './analyticsService';
import { formatDisplayDate } from '../utils/dates';

export const reportService = {
  generateReportData(
    type: ReportType,
    dateRange: DateRange,
    goals: Goal[],
    categories: Category[],
    records: DailyRecord[]
  ): ProgressReport {
    const rangeRecords = records.filter(
      (r) => r.date >= dateRange.startDate && r.date <= dateRange.endDate
    );

    const overall = analyticsService.calculateOverallSummary(
      goals,
      rangeRecords,
      categories,
      dateRange
    );

    const activeGoals = goals.filter((g) => g.active);
    const goalSummaries = activeGoals.map((goal) => {
      const goalRecords = records.filter((r) => r.goalId === goal.id);
      return analyticsService.calculateMetricSummary(
        goal,
        goalRecords,
        categories,
        dateRange
      );
    });

    const goalMap = new Map(goals.map((g) => [g.id, g]));
    const notes: { date: string; goalName: string; note: string }[] = [];

    for (const r of rangeRecords) {
      if (r.note && r.note.trim().length > 0) {
        const g = goalMap.get(r.goalId);
        notes.push({
          date: r.date,
          goalName: g?.name || 'Goal',
          note: r.note.trim(),
        });
      }
    }

    notes.sort((a, b) => b.date.localeCompare(a.date));

    let title = 'Progress Report';
    if (type === 'weekly') title = 'Weekly Progress Report';
    if (type === 'monthly') title = 'Monthly Progress Report';
    if (type === 'custom') title = 'Custom Period Progress Report';

    return {
      title,
      type,
      generatedAt: new Date().toISOString(),
      dateRange,
      overall,
      goalSummaries,
      notes,
    };
  },

  exportPDF(report: ProgressReport): void {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let cursorY = 20;

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(report.title, margin, 16);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    const dateRangeLabel = `${formatDisplayDate(report.dateRange.startDate, 'MMM d, yyyy')} - ${formatDisplayDate(report.dateRange.endDate, 'MMM d, yyyy')}`;
    doc.text(`Period: ${dateRangeLabel}  |  Generated: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, margin, 24);

    cursorY = 45;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Overall Performance Summary', margin, cursorY);
    cursorY += 6;

    const cardWidth = (pageWidth - margin * 2 - 10) / 3;
    const cardHeight = 22;

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, cursorY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('COMPLETION RATE', margin + 6, cursorY + 7);
    doc.setFontSize(14);
    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text(`${report.overall.overallCompletionRate}%`, margin + 6, cursorY + 16);

    const card2X = margin + cardWidth + 5;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(card2X, cursorY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('ACTIVE GOALS', card2X + 6, cursorY + 7);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.setFont('helvetica', 'bold');
    doc.text(`${report.overall.activeGoalsCount}`, card2X + 6, cursorY + 16);

    const card3X = card2X + cardWidth + 5;
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(card3X, cursorY, cardWidth, cardHeight, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text('PERFECT DAYS', card3X + 6, cursorY + 7);
    doc.setFontSize(14);
    doc.setTextColor(245, 158, 11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${report.overall.perfectDaysCount} / ${report.overall.totalDays}`, card3X + 6, cursorY + 16);

    cursorY += cardHeight + 10;

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('Goal Breakdown', margin, cursorY);
    cursorY += 4;

    const tableRows = report.goalSummaries.map((g) => [
      g.goalName,
      g.categoryName,
      g.type === 'boolean' ? 'Completed' : `${g.target} ${g.unit}`,
      g.type === 'boolean' ? `${g.completedDays} days` : `${g.totalValue} ${g.unit}`,
      `${g.completionRate}%`,
      `${g.completedDays} / ${g.totalScheduledDays}`,
      `${g.currentStreak}d (Best: ${g.bestStreak}d)`,
    ]);

    autoTable(doc, {
      startY: cursorY,
      margin: { left: margin, right: margin },
      head: [['Goal', 'Category', 'Target', 'Total Recorded', 'Completion %', 'Days Met', 'Streak']],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [2, 132, 199],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8.5,
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || cursorY + 50;
    cursorY = finalY + 12;

    if (report.notes.length > 0) {
      if (cursorY > 240) {
        doc.addPage();
        cursorY = 20;
      }

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Notes & Observations', margin, cursorY);
      cursorY += 6;

      const noteRows = report.notes.slice(0, 15).map((n) => [
        formatDisplayDate(n.date, 'MMM d'),
        n.goalName,
        n.note,
      ]);

      autoTable(doc, {
        startY: cursorY,
        margin: { left: margin, right: margin },
        head: [['Date', 'Goal', 'Note']],
        body: noteRows,
        theme: 'plain',
        headStyles: {
          fillColor: [226, 232, 240],
          textColor: [30, 41, 59],
          fontStyle: 'bold',
          fontSize: 8.5,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [71, 85, 105],
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 35 },
          2: { cellWidth: 'auto' },
        },
      });
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Personal Progress Tracker  •  Page ${i} of ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }

    const filename = `progress_report_${report.dateRange.startDate}_to_${report.dateRange.endDate}.pdf`;
    doc.save(filename);
  },
};
