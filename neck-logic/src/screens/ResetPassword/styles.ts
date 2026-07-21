export const styles = {
  safeArea: "flex-1 bg-background",
  keyboardView: "flex-1 w-full",
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 } as const,

  wrapper: "w-full max-w-[400px]",

  backButton: "absolute top-6 left-6 z-50 flex-row items-center gap-2 py-2",

  headerContainer: "items-center mb-10 mt-12",
  iconContainer: "w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-6",
  title: "text-3xl font-bold tracking-tight text-foreground mb-2 text-center",
  subtitle: "text-muted-foreground text-sm text-center leading-relaxed",
  emailHighlight: "text-foreground font-semibold",

  otpContainer: "flex-row justify-between w-full mb-8",
  otpInput: "w-[14%] aspect-square max-w-[55px] bg-input-background border border-border rounded-xl text-center text-xl font-bold text-foreground focus:border-primary focus:bg-primary/5",

  passwordContainer: "gap-5 mb-8 w-full",
  inputGroup: "gap-2",
  label: "text-sm font-medium text-foreground ml-1",
  inputWrapper: "relative justify-center",
  inputIcon: "absolute left-4 z-10",
  inputBase: "w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:border-primary",

  resendContainer: "items-center mb-8",
  resendText: "text-sm text-muted-foreground",
  resendButtonText: "text-primary font-bold text-sm",

  buttonBase: "w-full py-4 rounded-xl items-center",
  buttonText: "text-primary-foreground font-bold text-base",
};

export const getButtonStyle = (isLoading: boolean) => {
  return isLoading ? 'bg-primary/60' : 'bg-primary';
};