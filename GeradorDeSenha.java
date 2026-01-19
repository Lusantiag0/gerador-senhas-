import java.util.Random;
import java.util.Scanner;

public class GeradorDeSenha {

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        Random random = new Random();

        System.out.println("=== GERADOR DE SENHAS ===");

        System.out.print("Digite o tamanho da senha: ");
        int tamanho = scanner.nextInt();

        System.out.print("Incluir letras maiúsculas? (s/n): ");
        boolean maiusculas = scanner.next().equalsIgnoreCase("s");

        System.out.print("Incluir letras minúsculas? (s/n): ");
        boolean minusculas = scanner.next().equalsIgnoreCase("s");

        System.out.print("Incluir números? (s/n): ");
        boolean numeros = scanner.next().equalsIgnoreCase("s");

        System.out.print("Incluir símbolos? (s/n): ");
        boolean simbolos = scanner.next().equalsIgnoreCase("s");

        String senha = gerarSenha(tamanho, maiusculas, minusculas, numeros, simbolos, random);

        if (senha.isEmpty()) {
            System.out.println("Erro: selecione pelo menos um tipo de caractere.");
        } else {
            System.out.println("Senha gerada: " + senha);
        }

        scanner.close();
    }

    public static String gerarSenha(int tamanho, boolean maiusculas, boolean minusculas,
                                    boolean numeros, boolean simbolos, Random random) {

        String letrasMaiusculas = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String letrasMinusculas = "abcdefghijklmnopqrstuvwxyz";
        String numerosStr = "0123456789";
        String simbolosStr = "!@#$%&*()-_=+[]{}<>?";

        String caracteres = "";

        if (maiusculas) caracteres += letrasMaiusculas;
        if (minusculas) caracteres += letrasMinusculas;
        if (numeros) caracteres += numerosStr;
        if (simbolos) caracteres += simbolosStr;

        if (caracteres.isEmpty()) return "";

        StringBuilder senha = new StringBuilder();

        for (int i = 0; i < tamanho; i++) {
            int index = random.nextInt(caracteres.length());
            senha.append(caracteres.charAt(index));
        }

        return senha.toString();
    }
}
