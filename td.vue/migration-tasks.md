# Vue 3 Migration Tasks

*Generated on 2025-03-11*

## Components Needing Migration

| Component | Options API | Bootstrap-Vue | Vuex |
|-----------|-------------|---------------|------|
| src/components/.vue2-backup/AddBranchDialog.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/DashboardAction.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/FormButton.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/Graph.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/GraphButtons.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/GraphMeta.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/GraphProperties.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/GraphThreats.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/KeyValueCard.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/KeyboardShortcuts.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/LocaleSelect.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/Navbar.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/ProviderLoginButton.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/ReadOnlyDiagram.vue | ✅ |  |  |
| src/components/.vue2-backup/SelectionPage.vue | ✅ | ✅ |  |
| src/components/.vue2-backup/ThreatEditDialog.vue | ✅ | ✅ | ✅ |
| src/components/.vue2-backup/ThreatModelSummaryCard.vue | ✅ |  |  |
| src/components/.vue2-backup/ThreatSuggestDialog.vue | ✅ | ✅ | ✅ |
| src/components/AddBranchDialog.vue | ✅ | ✅ | ✅ |
| src/components/DashboardAction.vue | ✅ | ✅ |  |
| src/components/Graph.vue | ✅ | ✅ | ✅ |
| src/components/GraphButtons.vue | ✅ | ✅ |  |
| src/components/GraphMeta.vue | ✅ | ✅ | ✅ |
| src/components/GraphProperties.vue | ✅ | ✅ |  |
| src/components/GraphThreats.vue | ✅ | ✅ |  |
| src/components/KeyboardShortcuts.vue | ✅ | ✅ |  |
| src/components/ReadOnlyDiagram.vue | ✅ |  |  |
| src/components/SelectionPage.vue | ✅ | ✅ |  |
| src/components/ThreatEditDialog.vue | ✅ | ✅ | ✅ |
| src/components/ThreatModelSummaryCard.vue | ✅ |  |  |
| src/components/ThreatSuggestDialog.vue | ✅ | ✅ | ✅ |
| src/components/printed-report/.vue2-backup/Coversheet.vue | ✅ |  |  |
| src/components/printed-report/.vue2-backup/ExecutiveSummary.vue | ✅ |  |  |
| src/components/printed-report/.vue2-backup/ReportEntity.vue | ✅ |  |  |
| src/components/printed-report/Coversheet.vue | ✅ |  |  |
| src/components/printed-report/ExecutiveSummary.vue | ✅ |  |  |
| src/components/printed-report/ReportEntity.vue | ✅ |  |  |
| src/components/report/.vue2-backup/Coversheet.vue | ✅ | ✅ |  |
| src/components/report/.vue2-backup/DiagramDetail.vue | ✅ | ✅ |  |
| src/components/report/.vue2-backup/ExecutiveSummary.vue | ✅ | ✅ |  |
| src/components/report/.vue2-backup/ReportEntity.vue | ✅ | ✅ |  |
| src/components/report/Coversheet.vue | ✅ | ✅ |  |
| src/components/report/DiagramDetail.vue | ✅ | ✅ |  |
| src/components/report/ExecutiveSummary.vue | ✅ | ✅ |  |
| src/components/report/ReportEntity.vue | ✅ | ✅ |  |
| src/views/.vue2-backup/DiagramEdit.vue | ✅ | ✅ |  |
| src/views/.vue2-backup/HomePage.vue | ✅ | ✅ | ✅ |
| src/views/.vue2-backup/ImportModel.vue | ✅ | ✅ | ✅ |
| src/views/.vue2-backup/MainDashboard.vue | ✅ | ✅ |  |
| src/views/.vue2-backup/NewThreatModel.vue | ✅ |  | ✅ |
| src/views/.vue2-backup/OauthReturn.vue | ✅ |  | ✅ |
| src/views/.vue2-backup/ReportModel.vue | ✅ | ✅ |  |
| src/views/.vue2-backup/ThreatModel.vue | ✅ | ✅ | ✅ |
| src/views/.vue2-backup/ThreatModelEdit.vue | ✅ | ✅ | ✅ |
| src/views/ImportModel.vue | ✅ | ✅ | ✅ |
| src/views/MainDashboard.vue | ✅ | ✅ |  |
| src/views/NewThreatModel.vue | ✅ |  | ✅ |
| src/views/OauthReturn.vue | ✅ |  | ✅ |
| src/views/ReportModel.vue | ✅ | ✅ |  |
| src/views/ThreatModel.vue | ✅ | ✅ | ✅ |
| src/views/ThreatModelEdit.vue | ✅ | ✅ | ✅ |
| src/views/demo/.vue2-backup/SelectDemoModel.vue | ✅ | ✅ | ✅ |
| src/views/demo/SelectDemoModel.vue | ✅ | ✅ | ✅ |
| src/views/git/.vue2-backup/BranchAccess.vue | ✅ |  | ✅ |
| src/views/git/.vue2-backup/RepositoryAccess.vue | ✅ |  | ✅ |
| src/views/git/.vue2-backup/ThreatModelSelect.vue | ✅ |  | ✅ |
| src/views/git/BranchAccess.vue | ✅ |  | ✅ |
| src/views/git/RepositoryAccess.vue | ✅ |  | ✅ |
| src/views/git/ThreatModelSelect.vue | ✅ |  | ✅ |
| src/views/google/.vue2-backup/DriveAccess.vue | ✅ |  | ✅ |
| src/views/google/DriveAccess.vue | ✅ |  | ✅ |

## Summary

- Total components to migrate: 71
- Components using Options API: 71
- Components using Bootstrap-Vue: 49
- Components using Vuex: 34
