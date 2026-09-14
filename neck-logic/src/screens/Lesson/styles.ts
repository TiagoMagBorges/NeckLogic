import { DimensionValue } from 'react-native';

export const styles = {
    safeArea: "flex-1 bg-background",

    header: "flex-row items-center justify-between px-6 py-4",
    closeButton: "p-2",
    progressBarContainer: "flex-1 h-2 bg-muted/20 rounded-full mx-4 overflow-hidden",
    progressBarFill: "h-full bg-primary rounded-full",

    typeTag: "font-sans-bold text-primary text-xs uppercase tracking-widest mb-4 text-center",
    title: "font-serif-bold text-3xl text-foreground text-center mb-6",
    bodyText: "font-sans text-lg text-muted-foreground text-center leading-8",

    imageContainer: "w-full h-48 bg-card rounded-xl mb-8 items-center justify-center border border-border/20",
    imagePlaceholderText: "font-sans text-muted-foreground text-xs",

    footer: "p-6 pb-12",
    nextButton: "w-full bg-primary py-4 rounded-xl items-center shadow-lg",
    nextButtonText: "font-sans-bold text-background text-lg uppercase tracking-wide",

    choiceContainer: "w-full mt-6 gap-3",
    choiceButtonText: "font-sans-semibold text-foreground text-base text-center",
};

export const getProgressStyle = (current: number, total: number): { width: DimensionValue } => {
    const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;
    return { width: `${percentage}%` as DimensionValue };
};

export const getChoiceButtonStyle = (
  option: string,
  selectedChoice: string | null,
  checkResult: 'IDLE' | 'CORRECT' | 'INCORRECT'
): string => {
    const base = "w-full py-4 rounded-xl border items-center";
    const isSelected = option === selectedChoice;

    if (checkResult !== 'IDLE' && isSelected) {
        return checkResult === 'CORRECT'
          ? `${base} bg-[#10B981]/20 border-[#10B981]`
          : `${base} bg-destructive/20 border-destructive`;
    }

    return isSelected
      ? `${base} bg-primary/20 border-primary`
      : `${base} bg-card border-border/20`;
};