import { ModuleStatus } from '../../types/Module';

export const styles = {
    safeArea: "flex-1 bg-background",
    loadingContainer: "flex-1 bg-background justify-center items-center",
    contentContainer: "w-full max-w-md self-center",
    scrollContent: { padding: 24, paddingBottom: 100 },

    headerContainer: "mb-8 flex-row justify-between items-center",
    headerTexts: "flex-1 items-center",
    title: "font-serif-bold text-3xl text-foreground text-center",
    subtitle: "font-sans text-muted-foreground text-sm text-center",
    switchTrackButton: "w-11 h-11 rounded-full bg-primary/10 items-center justify-center border border-primary/20",

    levelCard: "w-full bg-card border border-border/10 rounded-2xl p-5 mb-10 shadow-sm",
    levelHeader: "flex-row justify-between items-end mb-3",
    levelText: "font-mono-bold text-primary text-2xl tracking-tight",
    xpText: "font-mono text-muted-foreground text-sm",
    progressBarBg: "h-2 w-full bg-muted/20 rounded-full overflow-hidden",
    progressBarFill: "h-full bg-primary rounded-full",

    pathWrapper: "relative",
    verticalLine: "absolute left-[31px] top-10 bottom-10 w-[2px] bg-muted/20",

    sectionGroup: "mb-8",
    sectionHeader: "flex-row items-center justify-between bg-background py-4 mb-4 z-20",
    sectionTitleText: "font-serif-bold text-xl text-foreground",
    sectionDescText: "font-sans text-xs text-muted-foreground mt-1 pr-4",
    skipButton: "w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20",

    nodeRow: "flex-row items-center mb-10",
    nodeBase: "z-10 w-16 h-16 rounded-full border-2 items-center justify-center",
    nodeText: "font-mono-bold text-xl text-primary-foreground",

    nodeInfoContainer: "ml-6 flex-1",
    nodeTitleBase: "font-sans-semibold text-lg text-foreground",
    nodeSubtitle: "font-sans text-sm text-muted-foreground",
    percentageText: "font-mono-bold text-primary",

    statsCard: "mt-4 bg-card border border-border/10 rounded-2xl p-6",
    statsTitle: "font-serif-bold text-foreground mb-6 text-center",
    statsRow: "flex-row justify-around",
    statItem: "items-center",
    statValuePrimary: "font-mono-bold text-2xl text-primary",
    statValueMuted: "font-mono-bold text-2xl text-muted-foreground",
    statLabel: "font-sans-bold text-[10px] text-muted-foreground uppercase",

    switcherBackdrop: "flex-1 bg-black/50 justify-center items-center px-6",
    switcherCard: "w-full max-w-sm bg-card border border-border/10 rounded-2xl p-5",
    switcherTitle: "font-serif-bold text-lg text-foreground mb-3",
    switcherEmpty: "font-sans text-muted-foreground text-sm text-center py-4",
    switcherItem: "flex-row items-center justify-between py-3 border-b border-border/10",
    switcherItemText: "font-sans-medium text-foreground text-base",
    switcherExploreButton: "flex-row items-center justify-center gap-2 mt-4 py-3 rounded-xl bg-primary/10 border border-primary/20",
    switcherExploreText: "font-sans-bold text-primary text-sm",
};

export const getNodeTheme = (status: ModuleStatus, isDarkTheme: boolean) => {
    const bgHex = isDarkTheme ? '#121212' : '#FFFFFF';
    const mutedHex = isDarkTheme ? '#A1A1AA' : '#71717A';

    switch (status) {
        case 'COMPLETED':
            return { bgClass: 'bg-foreground border-foreground', iconColor: bgHex, textOpacity: 'opacity-100' };
        case 'CURRENT':
            return { bgClass: 'bg-primary border-primary', iconColor: isDarkTheme ? '#121212' : '#FFFFFF', textOpacity: 'opacity-100' };
        case 'LOCKED':
        default:
            return { bgClass: 'bg-background border-muted', iconColor: mutedHex, textOpacity: 'opacity-40' };
    }
};