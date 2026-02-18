import { ModuleStatus } from '../../@types/Module';

export const styles = {
    safeArea: "flex-1 bg-background",
    loadingContainer: "flex-1 bg-background justify-center items-center",
    contentContainer: "w-full max-w-md self-center",
    scrollContent: { padding: 24, paddingBottom: 100 },

    headerContainer: "mb-12 relative flex-row justify-center items-center",
    headerTexts: "items-center",
    title: "text-3xl font-bold text-foreground text-center",
    subtitle: "text-muted-foreground text-sm text-center",
    logoutButton: "absolute right-0 p-2",
    logoutText: "text-destructive text-xs",

    pathWrapper: "gap-y-10 relative",
    verticalLine: "absolute left-[31px] top-0 bottom-0 w-[2px] bg-muted/20",

    nodeRow: "flex-row items-center",
    nodeBase: "z-10 w-16 h-16 rounded-full border-2 items-center justify-center",
    nodeText: "text-xl font-bold text-primary-foreground",

    nodeInfoContainer: "ml-6 flex-1",
    nodeTitleBase: "font-semibold text-lg text-foreground",
    nodeSubtitle: "text-sm text-muted-foreground",
    percentageText: "text-primary font-bold",

    statsCard: "mt-12 bg-card border border-border/10 rounded-2xl p-6",
    statsTitle: "text-foreground font-semibold mb-6 text-center",
    statsRow: "flex-row justify-around",
    statItem: "items-center",
    statValuePrimary: "text-2xl font-bold text-primary",
    statValueMuted: "text-2xl font-bold text-muted-foreground",
    statLabel: "text-[10px] text-muted-foreground font-bold",
};

export const getNodeTheme = (status: ModuleStatus) => {
    switch (status) {
        case 'COMPLETED':
            return { bgClass: 'bg-white border-white', iconColor: '#121212', textOpacity: 'opacity-100' };
        case 'CURRENT':
            return { bgClass: 'bg-primary border-primary', iconColor: '#121212', textOpacity: 'opacity-100' };
        case 'LOCKED':
        default:
            return { bgClass: 'bg-transparent border-muted', iconColor: '#A1A1AA', textOpacity: 'opacity-30' };
    }
};