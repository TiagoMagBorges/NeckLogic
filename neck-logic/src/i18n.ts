import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languageDetector: LanguageDetectorAsyncModule = {
    type: 'languageDetector',
    async: true,
    init: () => {},
    detect: async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('@NeckLogic:language');
            if (savedLanguage) {
                return savedLanguage;
            }

            const systemLang = Localization.getLocales()[0].languageTag;
            if (systemLang.startsWith('pt')) {
                return 'pt-BR';
            } else {
                return 'en';
            }
        } catch (error) {
            return 'en';
        }
    },
    cacheUserLanguage: async (lng: string) => {
        try {
            await AsyncStorage.setItem('@NeckLogic:language', lng);
        } catch (error) {}
    },
};

const resources = {
    en: {
        translation: {
            login: {
                subtitle: "Master the fretboard with precision",
                emailLabel: "Email",
                emailPlaceholder: "you@example.com",
                passwordLabel: "Password",
                passwordPlaceholder: "••••••••",
                rememberMe: "Remember me",
                forgotPassword: "Forgot your password?",
                signInButton: "Sign In",
                noAccount: "Don't have an account?",
                signUpLink: "Sign up",
                errorEmailInvalid: "Enter a valid email",
                errorPasswordRequired: "Password is required",
                errorAuthFailed: "Incorrect email or password.",
                errorNetwork: "Could not connect to the server. Check your connection.",
                modalTitle: "Authentication Failed",
                modalButton: "Try again",
                forgotModalTitle: "Reset Password",
                forgotModalDesc: "Enter your email. If an account exists, we will send a recovery code.",
                forgotModalSend: "Send Code"
            },
            register: {
                back: "Back to login",
                subtitle: "Start your music theory journey",
                nameLabel: "Full Name",
                namePlaceholder: "John Doe",
                agreeText: "I agree to the ",
                termsLink: "Terms of Service",
                andText: " and ",
                privacyLink: "Privacy Policy",
                createButton: "Create Account",
                hasAccount: "Already have an account?",
                signInLink: "Sign in",
                errorConflict: "This email is already registered.",
                errorInvalid: "The provided data is invalid. Please check and try again.",
                errorGeneric: "An internal error occurred. Try again later.",
                modalTitle: "Registration Failed",
                modalButton: "Close"
            },
            profile: {
                defaultUser: "User",
                totalXp: "Total XP",
                level: "Level",
                streak: "Streak",
                days: "days",
                fretboardLeveling: "Fretboard Leveling",
                nextLevel: "Next Level",
                keepGoing: "Continue the path to expand your fretboard vocabulary.",
                tuning: "Guitar Tuning",
                theme: "Theme",
                darkMode: "Dark Mode",
                lightMode: "Light Mode",
                accountSettings: "Account Settings",
                language: "Language"
            },
            account: {
                title: "Account Settings",
                personalInfo: "Personal Information",
                nameLabel: "Name",
                namePlaceholder: "Your name",
                emailLabel: "Email",
                emailPlaceholder: "you@example.com",
                saveProfile: "Save Profile",
                security: "Security",
                currentPassword: "Current Password",
                newPassword: "New Password",
                newPasswordPlaceholder: "Minimum 6 characters",
                confirmPassword: "Confirm New Password",
                updatePassword: "Update Password",
                accountActions: "Account Actions",
                signOut: "Sign Out",
                dangerZone: "Danger Zone",
                deleteAccount: "Delete My Account",
                modalCheckData: "Check your data",
                modalProfileSuccess: "All set",
                modalProfileSuccessDesc: "Your personal data has been saved successfully.",
                modalError: "Oops, something went wrong",
                modalErrorNetwork: "Could not communicate with the server.",
                modalSecurity: "Security",
                modalPasswordSuccess: "Your password has been updated and is now active.",
                modalPasswordError: "We couldn't update your password right now.",
                modalSignOutTitle: "Sign Out",
                modalSignOutDesc: "Are you sure you want to disconnect your account from this device?",
                modalYesSignOut: "Yes, Sign Out",
                modalCancel: "Cancel",
                modalDeleteTitle: "Delete Account",
                modalDeleteDesc: "This action will erase all your fretboard progress and cannot be undone. Are you sure you want to leave us?",
                modalYesDelete: "Yes, Delete",
                modalDeleteErrorTitle: "Could not delete",
                modalDeleteErrorDesc: "We faced an instability while trying to remove your data. Please try again."
            },
            onboarding: {
                title: "What's your level?",
                subtitle: "We will adjust the initial path based on your current knowledge of the fretboard.",
                beginner: "Beginner",
                beginnerDesc: "I'm starting from scratch.",
                intermediate: "Intermediate",
                intermediateDesc: "I already know the notes and basic navigation.",
                advanced: "Advanced",
                advancedDesc: "I want to focus on harmony and intervals.",
                errorTitle: "Error",
                errorDesc: "There was a problem configuring your level."
            },
            path: {
                title: "The Logic Path",
                subtitle: "Your journey to fretboard mastery",
                level: "Level",
                continue: "Continue learning",
                progressTitle: "Your Progress",
                completed: "COMPLETED",
                inProgress: "IN PROGRESS",
                remaining: "REMAINING",
                warningTitle: "Warning",
                warningDesc: "The ID for this section was not found.",
                errorTitle: "Error",
                errorDesc: "Could not skip this section."
            },
            lab: {
                title: "Scale Lab",
                subtitle: "Explore the neck and build your vocabulary",
                formula: "Formula:",
                customNotes: "Custom (Notes)",
                customIntervals: "Custom (Intervals)",
                mapping: "Fretboard Mapping",
                notes: "Notes",
                root: "Root",
                type: "Type",
                rootSelection: "Root Note",
                shapeSelection: "Scale Type / Shape",
                buildIntervals: "Build by Intervals",
                buildNotes: "Build by Free Notes",
                selectIntervals: "Select Intervals",
                selectNotes: "Select Notes"
            },
            tuning: {
                title: "Guitar Tuning",
                saved: "Saved",
                save: "Save",
                instruction: "Tap a tuning peg to change the string note",
                current: "Current:"
            },
            lesson: {
                complete: "Complete",
                next: "Next",
                check: "Check",
                tryAgain: "Try Again",
                image: "Image:",
                imageUnavailable: "Image unavailable",
                staffReadingHint: "Play the notes shown on the staff, in order",
                playAudio: "Play sound"
            },
            feedback: {
                perfect: "Perfect Timing!",
                completed: "Session Completed!",
                expanding: "Your fretboard mental map is expanding.",
                xpGained: "XP Gained",
                accuracy: "Accuracy",
                levelUp: "Level Up!",
                reachedLevel: "You reached Level",
                continue: "Continue the Path"
            },
            common: {
                ok: "OK",
                cancel: "Cancel",
                error: "Error",
                warning: "Warning"
            },
            modals: {
                skipTitle: "Skip Section?",
                skipDesc: "Are you sure you want to mark all content in \"{{section}}\" as completed? You will take a quick test to prove your knowledge.",
                takeTest: "Take Test"
            },
            hooks: {
                lessonEmptyTitle: "Warning",
                lessonEmptyDesc: "This lesson has no content yet.",
                lessonLoadError: "Failed to load the lesson.",
                lessonSaveError: "Could not save your progress.",
                pathLoadError: "Could not load your path."
            },
            verification: {
                title: "Check your email",
                resetTitle: "Reset your password",
                subtitle: "We sent a 6-digit code to ",
                verifyAccount: "Verify Account",
                resetPassword: "Reset Password",
                newPassword: "New Password",
                newPasswordPlaceholder: "Minimum 6 characters",
                resendCode: "Resend Code",
                resendIn: "Resend code in {{time}}s",
                errorIncomplete: "Please enter the 6-digit code.",
                errorPasswordMatch: "Passwords do not match.",
                successRegisterTitle: "Account Verified",
                successRegisterDesc: "Your account is now active. You can sign in.",
                successResetTitle: "Password Reset",
                successResetDesc: "Your password has been successfully updated.",
                signIn: "Go to Sign In"
            },
            tracks: {
                back: "Back",
                title: "Tracks",
                subtitle: "Choose a track to follow",
                empty: "No tracks available yet.",
                official: "Official",
                paid: "Paid",
                free: "Free",
                start: "Start",
                continue: "Continue",
                errorLoad: "Could not load the tracks.",
                errorEnroll: "Could not enroll in this track."
            }
        }
    },
    'pt-BR': {
        translation: {
            login: {
                subtitle: "Domine o braço da guitarra com precisão",
                emailLabel: "E-mail",
                emailPlaceholder: "voce@exemplo.com",
                passwordLabel: "Senha",
                passwordPlaceholder: "••••••••",
                rememberMe: "Lembrar de mim",
                forgotPassword: "Esqueceu sua senha?",
                signInButton: "Entrar",
                noAccount: "Não tem uma conta?",
                signUpLink: "Cadastre-se",
                errorEmailInvalid: "Digite um e-mail válido",
                errorPasswordRequired: "A senha é obrigatória",
                errorAuthFailed: "E-mail ou senha incorretos.",
                errorNetwork: "Não foi possível conectar ao servidor. Verifique sua conexão.",
                modalTitle: "Falha na Autenticação",
                modalButton: "Tentar novamente",
                forgotModalTitle: "Recuperar Senha",
                forgotModalDesc: "Digite seu e-mail. Se a conta existir, enviaremos um código de recuperação.",
                forgotModalSend: "Enviar Código"
            },
            register: {
                back: "Voltar para o login",
                subtitle: "Comece sua jornada na teoria musical",
                nameLabel: "Nome Completo",
                namePlaceholder: "João Silva",
                agreeText: "Eu concordo com os ",
                termsLink: "Termos de Serviço",
                andText: " e a ",
                privacyLink: "Política de Privacidade",
                createButton: "Criar Conta",
                hasAccount: "Já tem uma conta?",
                signInLink: "Entrar",
                errorConflict: "Este e-mail já está cadastrado em nossa plataforma.",
                errorInvalid: "Os dados fornecidos são inválidos. Verifique as informações.",
                errorGeneric: "Ocorreu um erro interno. Tente novamente mais tarde.",
                modalTitle: "Falha no Cadastro",
                modalButton: "Fechar"
            },
            profile: {
                defaultUser: "Usuário",
                totalXp: "Total XP",
                level: "Nível",
                streak: "Ofensiva",
                days: "dias",
                fretboardLeveling: "Nivelamento de Fretboard",
                nextLevel: "Próximo Nível",
                keepGoing: "Continue a trilha para expandir seu vocabulário no braço.",
                tuning: "Afinação da Guitarra",
                theme: "Tema",
                darkMode: "Modo Escuro",
                lightMode: "Modo Claro",
                accountSettings: "Configurações da Conta",
                language: "Idioma"
            },
            account: {
                title: "Configurações da Conta",
                personalInfo: "Informações Pessoais",
                nameLabel: "Nome",
                namePlaceholder: "Seu nome",
                emailLabel: "E-mail",
                emailPlaceholder: "seu@email.com",
                saveProfile: "Salvar Perfil",
                security: "Segurança",
                currentPassword: "Senha Atual",
                newPassword: "Nova Senha",
                newPasswordPlaceholder: "Mínimo 6 caracteres",
                confirmPassword: "Confirmar Nova Senha",
                updatePassword: "Atualizar Senha",
                accountActions: "Ações da Conta",
                signOut: "Sair da Sessão",
                dangerZone: "Zona de Perigo",
                deleteAccount: "Excluir Minha Conta",
                modalCheckData: "Verifique os dados",
                modalProfileSuccess: "Tudo certo",
                modalProfileSuccessDesc: "Seus dados pessoais foram salvos com sucesso.",
                modalError: "Ops, algo deu errado",
                modalErrorNetwork: "Não foi possível comunicar com o servidor. Verifique sua conexão e tente novamente.",
                modalSecurity: "Segurança",
                modalPasswordSuccess: "Sua senha foi atualizada e já está ativa.",
                modalPasswordError: "Não conseguimos atualizar sua senha agora. Tente novamente mais tarde.",
                modalSignOutTitle: "Sair da Sessão",
                modalSignOutDesc: "Tem certeza que deseja desconectar sua conta deste dispositivo?",
                modalYesSignOut: "Sim, Sair",
                modalCancel: "Cancelar",
                modalDeleteTitle: "Excluir Conta",
                modalDeleteDesc: "Esta ação apagará todo o seu progresso no fretboard e não poderá ser desfeita. Tem certeza que deseja nos deixar?",
                modalYesDelete: "Sim, Excluir",
                modalDeleteErrorTitle: "Não foi possível excluir",
                modalDeleteErrorDesc: "Enfrentamos uma instabilidade ao tentar remover seus dados. Por favor, tente novamente."
            },
            onboarding: {
                title: "Qual o seu nível?",
                subtitle: "Ajustaremos a trilha inicial baseada no seu conhecimento atual do braço da guitarra.",
                beginner: "Iniciante",
                beginnerDesc: "Estou começando do zero.",
                intermediate: "Intermediário",
                intermediateDesc: "Já conheço as notas e navegação básica.",
                advanced: "Avançado",
                advancedDesc: "Quero focar em harmonia e intervalos.",
                errorTitle: "Erro",
                errorDesc: "Ocorreu um problema ao configurar seu nível."
            },
            path: {
                title: "The Logic Path",
                subtitle: "Sua jornada para o domínio do braço",
                level: "Nível",
                continue: "Continuar aprendizado",
                progressTitle: "Seu Progresso",
                completed: "CONCLUÍDO",
                inProgress: "EM ANDAMENTO",
                remaining: "RESTANTES",
                warningTitle: "Aviso",
                warningDesc: "O ID desta seção não foi encontrado.",
                errorTitle: "Erro",
                errorDesc: "Não foi possível pular esta seção."
            },
            lab: {
                title: "Scale Lab",
                subtitle: "Explore o braço e construa seu vocabulário",
                formula: "Fórmula:",
                customNotes: "Custom (Notas)",
                customIntervals: "Custom (Intervals)",
                mapping: "Mapeamento do Braço",
                notes: "Notas",
                root: "Tônica",
                type: "Tipo",
                rootSelection: "Nota Tônica (Root)",
                shapeSelection: "Tipo de Escala / Shape",
                buildIntervals: "Construir por Intervalos",
                buildNotes: "Construir por Notas Livres",
                selectIntervals: "Selecione os Intervalos",
                selectNotes: "Selecione as Notas"
            },
            tuning: {
                title: "Afinação",
                saved: "Salvo",
                save: "Salvar",
                instruction: "Toque em uma tarraxa para alterar a nota da corda",
                current: "Atual:"
            },
            lesson: {
                complete: "Concluir",
                next: "Próximo",
                check: "Conferir",
                tryAgain: "Tentar Novamente",
                image: "Imagem:",
                imageUnavailable: "Imagem indisponível",
                staffReadingHint: "Toque as notas mostradas na partitura, em ordem",
                playAudio: "Tocar som"
            },
            feedback: {
                perfect: "Tempo Perfeito!",
                completed: "Sessão Concluída!",
                expanding: "Seu mapa mental do braço está se expandindo.",
                xpGained: "XP Ganho",
                accuracy: "Precisão",
                levelUp: "Level Up!",
                reachedLevel: "Você alcançou o Nível",
                continue: "Continuar a Trilha"
            },
            common: {
                ok: "OK",
                cancel: "Cancelar",
                error: "Erro",
                warning: "Aviso"
            },
            modals: {
                skipTitle: "Pular Seção?",
                skipDesc: "Tem certeza que deseja marcar todo o conteúdo de \"{{section}}\" como concluído? Você fará um teste rápido para provar seus conhecimentos.",
                takeTest: "Fazer Teste"
            },
            hooks: {
                lessonEmptyTitle: "Aviso",
                lessonEmptyDesc: "Esta aula ainda não tem conteúdo.",
                lessonLoadError: "Falha ao carregar a aula.",
                lessonSaveError: "Não foi possível salvar o progresso.",
                pathLoadError: "Não foi possível carregar sua trilha."
            },
            verification: {
                title: "Verifique seu e-mail",
                resetTitle: "Redefinir sua senha",
                subtitle: "Enviamos um código de 6 dígitos para ",
                verifyAccount: "Verificar Conta",
                resetPassword: "Redefinir Senha",
                newPassword: "Nova Senha",
                newPasswordPlaceholder: "Mínimo 6 caracteres",
                resendCode: "Reenviar Código",
                resendIn: "Reenviar código em {{time}}s",
                errorIncomplete: "Por favor, digite o código de 6 dígitos.",
                errorPasswordMatch: "As senhas não coincidem.",
                successRegisterTitle: "Conta Verificada",
                successRegisterDesc: "Sua conta já está ativa. Você pode fazer o login.",
                successResetTitle: "Senha Redefinida",
                successResetDesc: "Sua senha foi atualizada com sucesso.",
                signIn: "Ir para o Login"
            },
            tracks: {
                back: "Voltar",
                title: "Trilhas",
                subtitle: "Escolha uma trilha para seguir",
                empty: "Nenhuma trilha disponível ainda.",
                official: "Oficial",
                paid: "Paga",
                free: "Grátis",
                start: "Começar",
                continue: "Continuar",
                errorLoad: "Não foi possível carregar as trilhas.",
                errorEnroll: "Não foi possível se matricular nessa trilha."
            }
        }
    }
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
      resources,
      fallbackLng: 'en',
      compatibilityJSON: 'v4',
      interpolation: {
          escapeValue: false
      }
  });

export default i18n;