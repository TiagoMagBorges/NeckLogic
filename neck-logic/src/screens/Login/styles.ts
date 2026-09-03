export const styles = {
    container: "flex-1 bg-background",
    keyboardView: "flex-1 w-full",
    scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 } as const,

    wrapper: "w-full max-w-[400px]",

    headerContainer: "items-center mb-10",
    logoText: "text-4xl font-bold tracking-tight text-foreground mb-2",
    logoAccent: "text-primary",
    subtitle: "text-muted-foreground text-sm",

    formContainer: "gap-5",
    inputGroup: "gap-2",
    label: "text-sm font-medium text-foreground ml-1",
    inputWrapper: "relative justify-center",
    iconContainer: "absolute left-4 z-10",
    eyeButton: "absolute right-4 z-10",

    inputBase: "w-full bg-input-background border rounded-xl pl-12 pr-4 py-4 text-foreground focus:border-primary",
    inputBasePassword: "pr-12",
    errorText: "text-destructive text-xs mt-1 ml-1",

    buttonBase: "w-full py-4 rounded-xl items-center mt-2",
    buttonText: "text-primary-foreground font-bold text-base",

    dividerContainer: "flex-row items-center my-8",
    dividerLine: "flex-1 h-[1px] bg-border",
    dividerText: "mx-4 text-sm text-muted-foreground",

    socialContainer: "gap-4",
    socialButton: "w-full bg-card border border-border py-4 rounded-xl flex-row items-center justify-center gap-3",
    socialText: "text-foreground font-medium",
    googleIcon: "text-foreground font-bold text-lg",

    footerContainer: "flex-row justify-center mt-8",
    footerText: "text-sm text-muted-foreground",
    signupText: "text-primary font-bold ml-1",
};

export const getInputStyle = (hasError: boolean) => {
    return hasError ? 'border-destructive' : 'border-border';
};

export const getButtonStyle = (isLoading: boolean) => {
    return isLoading ? 'bg-primary/60' : 'bg-primary';
};