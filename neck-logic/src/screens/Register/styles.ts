export const styles = {
    safeArea: "flex-1 bg-background",
    keyboardView: "flex-1 w-full",
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 } as const,

    wrapper: "w-full max-w-[400px]",

    backButton: "flex-row items-center gap-2 mb-6 self-start",
    backText: "text-sm text-muted-foreground font-medium",

    headerContainer: "items-center mb-10",
    title: "text-4xl font-bold tracking-tight text-foreground mb-2",
    titleAccent: "text-primary",
    subtitle: "text-muted-foreground text-sm",

    formContainer: "gap-5",
    inputGroup: "gap-2",
    label: "text-sm font-medium text-foreground ml-1",
    inputWrapper: "relative justify-center",
    iconPosition: "absolute left-4 z-10",

    inputBase: "w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:border-primary",

    termsContainer: "flex-row items-start gap-3 mt-1",
    checkboxBase: "mt-1 w-5 h-5 rounded border items-center justify-center",
    termsTextWrapper: "flex-1 flex-row flex-wrap",
    termsText: "text-sm text-muted-foreground leading-relaxed",
    linkText: "text-sm text-primary font-medium leading-relaxed",

    buttonBase: "w-full py-4 rounded-xl items-center mt-4",
    buttonText: "text-primary-foreground font-bold text-base",

    dividerContainer: "flex-row items-center my-8",
    dividerLine: "flex-1 h-[1px] bg-border",
    dividerText: "mx-4 text-sm text-muted-foreground",

    socialContainer: "gap-4",
    socialButton: "w-full bg-card border border-border py-4 rounded-xl flex-row items-center justify-center gap-3",
    socialText: "text-foreground font-medium",
    googleText: "text-foreground font-bold text-lg",

    footerContainer: "flex-row justify-center mt-8",
    footerText: "text-sm text-muted-foreground",
    signInText: "text-primary font-bold ml-1",
};

export const getCheckboxStyle = (checked: boolean) => {
    return checked ? 'bg-primary border-primary' : 'bg-input-background border-border';
};

export const getButtonStyle = (isLoading: boolean) => {
    return isLoading ? 'bg-primary/60' : 'bg-primary';
};