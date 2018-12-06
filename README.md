# tax-calculation
# Projeto para Vaga de Engenheiro de Software Sênior Avalara
Susumu Asaga

## Aplicativo TaxCalculation

O aplicativo já foi implantado em uma instância do EC2 e pode ser acessado de qualquer lugar por meio da url http://ec2-18-228-172-210.sa-east-1.compute.amazonaws.com:3000 .

Pelo Browser o usuário terá acesso ao **frontend**, onde poderá visualizar uma tela de listagem das transações que foram enviadas e calculadas pelo **backend**.

No mesma url, na rota POST(`/api/transactions`), o usuário poderá enviar uma transação que será completada com o cálculo dos impostos e devolvida como resposta pelo **backend**. O formato de troca de dados é o JSON, usando a interface especificada com as correções propostas na issue #7.

## Implantação em outra instância do EC2 Amazon Linux

Foram implementados scripts para implantação do GitHub usando o AWS CodeDeploy, facilitando o trabalho de implantação, que será detalhado nas seções seguintes.

### Pré-requisitos

1. **Criar instância do EC2 Amazon Linux 2**.

2. **Adicione regras do grupo de segurança para abrir o porto 3000**, que será usado para acessar o servidor do API Rest.

3. **Instalar Cassandra** e **iniciar o serviço**.

4. **Instalar Node.js** na última versão LTS.

5. **Criar espaço em disco para swap de memória virtual**. Para isso, siga as instruções abaixo:
  * `sudo fallocate -l 4G /swapfile` Cria um arquivo de swap de 4 GB.
  * `sudo chmod 600 /swapfile` Proteja o arquivo de swap restringindo o acesso ao root.
  * `sudo mkswap /swapfile`. Marque o arquivo como espaço de swap.
  * `sudo swapon /swapfile` Habilite o swap.
  * `echo "/swapfile none swap sw 0 0" | sudo tee -a /etc/fstab`. Persiste o arquivo de swap nas reinicializações.

### Criar um aplicativo e um grupo de implantação usando o console AWS CodeDeploy

1. Entre no Console de gerenciamento da AWS e abra o console AWS CodeDeploy em http://console.aws.amazon/codedeploy.

2. Escolha **Create application (Criar aplicativo)** e selecione **Custom application (Aplicativo personalizado)**.

3. Em **Application name (Nome do aplicativo)**, insira **TaxCalculation-App**.

4. Em **Compute platform (Plataforma de computação)**, selecione **EC2/On-Premises (EC2/no local)**.

5. Selecione **Criar aplicativo**.

6. Na guia **Deployment groups (Grupos de implantação)**, selecione **Create deployment group (Criar um grupo de implantação)**.

7. Em **Deployment group name (Nome do grupo de implantação)**, insira **TaxCalculation-DepGrp**.

8. Em **Service Role (Função do serviço)**, selecione o nome da função do serviço do AWS CodeDeploy.

9. Em **Deployment type (Tipo de implantação)**, selecione **In-place (No local)**.

10. Em **Environment configuration (Configuração do ambiente)**, dependendo do tipo de instância que você estiver usando, selecione **Amazon EC2 instances (Instâncias do EC2)** ou **On-premises instances (Instâncias locais)**. Em **Key (Chave) e Value (Valor)**, digite a chave de tag da instância e o valor que foi aplicado à instância.

11. Em **Deployment configuration (Configuração de implantação)**, selecione **CodeDeployDefault.AllatOnce**.

12. Em **Load Balancer**, desmarque **Enable load balancing (Habilitar balanceamento de carga)**.

13. Selecione **Create deployment group (Criar grupo de implantação)**.

### Implantar o TaxCalculation na instância

1. Na página **Deployment group details (Detalhes do grupo de implantação)**, selecione **Create deployment (Criar implantação)**.

1. Em **Deployment group (Grupo de implantação)**, selecione **TaxCalculation-DepGrp**.

1. Em **Revision type (Tipo de revisão)**, selecione **GitHub**.

1. Em Conectar-se ao GitHub, faça um dos seguintes procedimentos:

  * Em **GitHub account (Conta do GitHub)**, digite um nome para identificar essa conexão e escolha **Connect to GitHub (Conectar-se ao GitHub)**. A página da web solicita que você autorize o AWS CodeDeploy a interagir com o GitHub para o aplicativo chamado **TaxCalculation-App**. Continue na etapa 5.

  * Para usar uma conexão já criada, em **Conta do GitHub**, selecione seu nome e escolha **Conectar-se ao GitHub**. Continue na etapa 7.

1. Siga as instruções na página **Fazer login** para entrar com a sua conta do GitHub.

1. Na página para **Autorizar aplicativo**, escolha **Autorizar aplicativo**.

1. Na página **Create deployment (Criar implantação)** do AWS CodeDeploy, em **Repository name (Nome do repositório)**, digite **susumuasaga/tax-calculation**.

1. Na caixa **Commit ID (ID de confirmação)**, digite o ID da commit associada ao envio da sua revisão de aplicativo ao GitHub.

1. Escolha **Implantar**.

### Finalizar a implantação

1. Aguarde alguns minutos para finalização da implantação.

1. Se **Failed (Falhou)** aparecer no painel **Deployment status (Situação da implantação**, verifique o que aconteceu no painel **Deployment lifecycle events (Eventos de ciclo de vida da implantação)**.

1. Se **Succeeded (Bem-sucedido)** aparecer no painel, você poderá verificar a implantação no seu navegador da Web. Se estiver implantando em uma instância do Amazon EC2, no seu navegador da Web, acesse http://public-dns:3000 para a instância (por exemplo, http://ec2-18-228-172-210.sa-east-1.compute.amazonaws.com:3000 ).

1. Se conseguir ver a página da Web, parabéns!. Para parar o serviço execute o script `stop_server.sh` e para reiniciá-lo execute o script `start_server.sh`.
