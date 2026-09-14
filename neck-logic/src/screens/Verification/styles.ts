export const styles = {
  safeArea: "flex-1 bg-background",
  keyboardView: "flex-1 w-full",
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 } as const,

  wrapper: "w-full max-w-[400px]",

  backButton: "absolute top-6 left-6 z-50 flex-row items-center gap-2 py-2",

  headerContainer: "items-center mb-10 mt-12",
  iconContainer: "w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-6",
  title: "font-serif-bold text-3xl tracking-tight text-foreground mb-2 text-center",
  subtitle: "font-sans text-muted-foreground text-sm text-center leading-relaxed",
  emailHighlight: "font-sans-semibold text-foreground",

  otpContainer: "flex-row justify-between w-full mb-8",
  otpInput: "w-[14%] aspect-square max-w-[55px] bg-input-background border border-border rounded-xl text-center font-mono-bold text-xl text-foreground focus:border-primary focus:bg-primary/5",

  passwordContainer: "gap-5 mb-8 w-full",
  inputGroup: "gap-2",
  label: "font-sans-medium text-sm text-foreground ml-1",
  inputWrapper: "relative justify-center",
  inputIcon: "absolute left-4 z-10",
  inputBase: "w-full bg-input-background border border-border rounded-xl pl-12 pr-4 py-4 text-foreground focus:border-primary",

  resendContainer: "items-center mb-8",
  resendText: "font-sans text-sm text-muted-foreground",
  resendButtonText: "font-sans-bold text-primary text-sm",

  buttonBase: "w-full py-4 rounded-xl items-center",
  buttonText: "font-sans-bold text-primary-foreground text-base",
};

export const getButtonStyle = (isLoading: boolean) => {
  return isLoading ? 'bg-primary/60' : 'bg-primary';
};