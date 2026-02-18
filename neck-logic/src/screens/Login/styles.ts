
export const styles = {
    container: "flex-1 bg-background",
    keyboardView: "flex-1",
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 } as const, // 'as const' ajuda o TS

    headerContainer: "items-center mb-12",
    logoText: "text-4xl font-bold tracking-tight text-foreground mb-2",
    logoAccent: "text-primary",
    subtitle: "text-muted-foreground text-sm",

    formContainer: "space-y-6",
    inputGroup: "space-y-2",
    label: "text-sm font-medium text-foreground",
    inputWrapper: "relative justify-center",
    iconContainer: "absolute left-4 z-10",

    inputBase: "w-full bg-input-background border rounded-lg pl-12 pr-4 py-3 text-white focus:border-primary",

    errorText: "text-destructive text-xs mt-1",

    buttonBase: "w-full py-3 rounded-lg items-center",
    buttonText: "text-primary-foreground font-semibold text-base",

    dividerContainer: "flex-row items-center my-8",
    dividerLine: "flex-1 h-[1px] bg-border",
    dividerText: "mx-4 text-sm text-muted-foreground",

    socialContainer: "gap-3",
    socialButton: "w-full bg-card border border-border py-3 rounded-lg flex-row items-center justify-center gap-3",
    socialText: "text-foreground font-medium",
    googleIcon: "text-foreground font-bold text-lg",

    footerContainer: "flex-row justify-center mt-8 mb-4",
    footerText: "text-sm text-muted-foreground",
    signupText: "text-primary font-medium ml-1",
};

export const getInputStyle = (hasError: boolean) => {
    return hasError ? 'border-destructive' : 'border-border';
};

export const getButtonStyle = (isLoading: boolean) => {
    return isLoading ? 'bg-primary/60' : 'bg-primary';
};