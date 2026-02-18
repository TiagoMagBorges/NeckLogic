export const styles = {
    safeArea: "flex-1 bg-background",
    keyboardView: "flex-1",
    scrollContent: { flexGrow: 1, padding: 24 } as const,

    backButton: "flex-row items-center gap-2 mb-8 self-start",
    backText: "text-sm text-muted-foreground",

    headerContainer: "items-center mb-12",
    title: "text-4xl font-bold tracking-tight text-foreground mb-2",
    titleAccent: "text-primary",
    subtitle: "text-muted-foreground text-sm",

    formContainer: "space-y-6",
    inputGroup: "space-y-2",
    label: "text-sm font-medium text-foreground",
    inputWrapper: "relative justify-center",
    iconPosition: "absolute left-4 z-10",

    inputBase: "w-full bg-input-background border border-border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary",

    termsContainer: "flex-row items-start gap-3 mt-2",
    checkboxBase: "mt-1 w-5 h-5 rounded border items-center justify-center",
    termsTextWrapper: "flex-1 flex-row flex-wrap",
    termsText: "text-sm text-muted-foreground",
    linkText: "text-sm text-primary font-medium",

    buttonBase: "w-full py-3 rounded-lg items-center",
    buttonText: "text-primary-foreground font-semibold text-base",

    dividerContainer: "flex-row items-center my-8",
    dividerLine: "flex-1 h-[1px] bg-border",
    dividerText: "mx-4 text-sm text-muted-foreground",

    socialContainer: "gap-3",
    socialButton: "w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3",
    socialText: "text-foreground font-medium",
    googleText: "text-foreground font-bold text-lg",

    footerContainer: "flex-row justify-center mt-8 mb-4",
    footerText: "text-sm text-muted-foreground",
    signInText: "text-primary font-medium ml-1",
};

export const getCheckboxStyle = (checked: boolean) => {
    return checked ? 'bg-primary border-primary' : 'bg-input-background border-border';
};

export const getButtonStyle = (isLoading: boolean) => {
    return isLoading ? 'bg-primary/60' : 'bg-primary';
};