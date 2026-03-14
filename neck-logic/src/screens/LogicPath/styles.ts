import { ModuleStatus } from '../../types/Module';

export const styles = {
    safeArea: "flex-1 bg-background",
    loadingContainer: "flex-1 bg-background justify-center items-center",
    contentContainer: "w-full max-w-md self-center",
    scrollContent: { padding: 24, paddingBottom: 100 },

    headerContainer: "mb-8 flex-row justify-center items-center",
    headerTexts: "items-center",
    title: "text-3xl font-bold text-foreground text-center",
    subtitle: "text-muted-foreground text-sm text-center",

    levelCard: "w-full bg-card border border-border/10 rounded-2xl p-5 mb-10 shadow-sm",
    levelHeader: "flex-row justify-between items-end mb-3",
    levelText: "text-primary font-bold text-2xl tracking-tight",
    xpText: "text-muted-foreground text-sm font-semibold",
    progressBarBg: "h-2 w-full bg-muted/20 rounded-full overflow-hidden",
    progressBarFill: "h-full bg-primary rounded-full",

    pathWrapper: "relative",
    verticalLine: "absolute left-[31px] top-10 bottom-10 w-[2px] bg-muted/20",

    sectionGroup: "mb-8",
    sectionHeader: "flex-row items-center justify-between bg-background py-4 mb-4 z-20",
    sectionTitleText: "text-xl font-bold text-foreground",
    sectionDescText: "text-xs text-muted-foreground mt-1 pr-4",
    skipButton: "w-12 h-12 rounded-full bg-primary/10 items-center justify-center border border-primary/20",

    nodeRow: "flex-row items-center mb-10",
    nodeBase: "z-10 w-16 h-16 rounded-full border-2 items-center justify-center",
    nodeText: "text-xl font-bold text-primary-foreground",

    nodeInfoContainer: "ml-6 flex-1",
    nodeTitleBase: "font-semibold text-lg text-foreground",
    nodeSubtitle: "text-sm text-muted-foreground",
    percentageText: "text-primary font-bold",

    statsCard: "mt-4 bg-card border border-border/10 rounded-2xl p-6",
    statsTitle: "text-foreground font-semibold mb-6 text-center",
    statsRow: "flex-row justify-around",
    statItem: "items-center",
    statValuePrimary: "text-2xl font-bold text-primary",
    statValueMuted: "text-2xl font-bold text-muted-foreground",
    statLabel: "text-[10px] text-muted-foreground font-bold uppercase",
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