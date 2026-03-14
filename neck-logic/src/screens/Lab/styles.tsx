export const styles = {
    safeArea: "flex-1 bg-background",
    scrollContent: { padding: 24, paddingBottom: 100 },

    header: "mb-6 items-center",
    title: "text-3xl font-bold text-foreground mb-2 text-center",
    subtitle: "text-muted-foreground text-center",

    activeScaleContainer: "items-center mb-8",
    activeScaleTitle: "text-2xl font-bold text-foreground mb-1 tracking-tight",
    activeScaleFormula: "text-muted-foreground text-sm mb-3",
    activeScaleNotesRow: "flex-row flex-wrap justify-center",
    textNoteRoot: "font-bold text-[#A855F7] text-xl",
    textNoteNormal: "font-bold text-primary text-xl",
    textNoteSeparator: "text-muted-foreground/50 text-xl",

    card: "bg-card border border-border/10 rounded-xl p-6 mb-8 shadow-sm",
    cardTitle: "text-sm font-bold text-foreground mb-4 uppercase tracking-wider",

    gridList: "flex-row flex-wrap gap-2",

    pillButton: "px-4 py-3 rounded-xl border border-border/20 items-center justify-center min-w-[50px]",
    pillButtonActive: "bg-primary border-primary",
    pillButtonRoot: "bg-[#A855F7] border-[#A855F7]",

    pillText: "font-bold text-muted-foreground",
    pillTextActive: "text-[#121212]",
    pillTextRoot: "text-white",

    typeButton: "w-full flex-row justify-between items-center px-4 py-4 rounded-xl border border-border/20 mb-2 bg-secondary/50",
    typeButtonActive: "bg-primary border-primary",
    typeText: "font-semibold text-muted-foreground",
    typeTextActive: "text-[#121212] font-bold",

    fretboardContainer: "bg-[#18181B] border border-border/10 rounded-xl overflow-hidden mb-8",
    fretboardHeader: "px-4 py-3 border-b border-border/10 bg-card",
    fretboardTitle: "text-xs font-bold text-muted-foreground uppercase",

    statsRow: "flex-row justify-between gap-4",
    statBox: "flex-1 bg-card border border-border/10 rounded-xl p-4 items-center",
    statLabel: "text-[10px] text-muted-foreground font-bold uppercase mb-1",
    statValueBlue: "text-2xl font-bold text-primary",
    statValuePurple: "text-2xl font-bold text-[#A855F7]",
    statValueGreen: "text-2xl font-bold text-[#10B981]",
};