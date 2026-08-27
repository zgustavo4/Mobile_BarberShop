import React, {
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  FlatList
} from 'react-native';

import {
  NavigationContainer,
  useFocusEffect
} from '@react-navigation/native';

import {
  createNativeStackNavigator
} from '@react-navigation/native-stack';


// ======================================================
// CONFIGURAÇÃO
// ======================================================

const API_URL = 'http://10.0.2.2:3000';

const Stack = createNativeStackNavigator();


// ======================================================
// CORES
// ======================================================

const COLORS = {
  bg: '#111111',
  card: '#1E1E1E',
  card2: '#242424',
  border: '#303030',

  yellow: '#F5C542',
  yellowDark: '#D9AB27',

  white: '#FFFFFF',
  text: '#F5F5F5',
  gray: '#8E8E8E',
  gray2: '#666666',

  blue: '#173B73',
  blueCard: '#183A70',

  green: '#35C982',
  red: '#F05B5B'
};


// ======================================================
// COMPONENTES VISUAIS
// ======================================================

function Logo() {
  return (
    <View style={styles.logoBadge}>
      <Text style={styles.logoIcon}>✂</Text>
    </View>
  );
}


function SectionTitle({ children }) {
  return (
    <Text style={styles.sectionTitle}>
      {children}
    </Text>
  );
}


function PrimaryButton({
  title,
  onPress,
  loading = false
}) {
  return (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#111111" />
      ) : (
        <Text style={styles.primaryButtonText}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}


// ======================================================
// 1. LOGIN
// ======================================================

function LoginScreen({ navigation }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {

    if (!email.trim() || !senha.trim()) {
      Alert.alert(
        'Atenção',
        'Preencha todos os campos!'
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim(),
            senha: senha.trim()
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {

        if (data.primeiro_acesso) {

          Alert.alert(
            'Primeiro acesso',
            data.mensagem
          );

          navigation.navigate(
            'PrimeiroAcesso',
            {
              id_usuario:
                data.usuario_id
            }
          );

          return;
        }

        Alert.alert(
          'Erro',
          data.mensagem ||
          data.error ||
          'Falha ao autenticar.'
        );

        return;
      }


      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Home',
            params: {
              user: data.usuario
            }
          }
        ]
      });


    } catch (error) {

      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <SafeAreaView style={styles.screen}>

      <ScrollView
        contentContainerStyle={
          styles.authContainer
        }
        keyboardShouldPersistTaps="handled"
      >

        <Logo />

        <Text style={styles.brand}>
          BarberShop
        </Text>

        <Text style={styles.authTitle}>
          Bem-vindo de volta
        </Text>

        <Text style={styles.authSubtitle}>
          Faça login para continuar
        </Text>


        <View style={styles.form}>

          <Text style={styles.label}>
            E-MAIL
          </Text>

          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={COLORS.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />


          <Text style={styles.label}>
            SENHA
          </Text>

          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={COLORS.gray}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />


          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() => {
              Alert.alert(
                'Recuperação',
                'Entre em contato com a barbearia para recuperar sua senha.'
              );
            }}
          >
            <Text style={styles.yellowText}>
              Esqueci a senha
            </Text>
          </TouchableOpacity>


          <PrimaryButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
          />


          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>
              OU
            </Text>
            <View style={styles.orLine} />
          </View>


          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Cadastro')
            }
          >
            <Text style={styles.bottomLink}>
              Não tem uma conta?{' '}
              <Text style={styles.yellowText}>
                Cadastre-se
              </Text>
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// 2. CADASTRO
// ======================================================

function CadastroScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);


  const handleCadastrar = async () => {

    if (
      !nome.trim() ||
      !email.trim() ||
      !cep.trim() ||
      !senha.trim()
    ) {

      Alert.alert(
        'Atenção',
        'Preencha todos os campos!'
      );

      return;
    }


    setLoading(true);

    try {

      const response = await fetch(
        `${API_URL}/cadastrar`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({
            nome_completo:
              nome.trim(),

            email:
              email.trim(),

            cep:
              cep.trim(),

            senha:
              senha.trim()
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        Alert.alert(
          'Erro',
          data.error ||
          data.mensagem ||
          'Não foi possível cadastrar.'
        );

        return;
      }


      Alert.alert(
        'Sucesso!',
        'Conta criada com sucesso!',
        [
          {
            text: 'Entrar',
            onPress: () =>
              navigation.navigate('Login')
          }
        ]
      );


    } catch (error) {

      Alert.alert(
        'Erro de conexão',
        'Não foi possível conectar ao servidor.'
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <SafeAreaView style={styles.screen}>

      <ScrollView
        contentContainerStyle={
          styles.authContainer
        }
      >

        <View style={styles.authHeader}>
          <Logo />

          <Text style={styles.brand}>
            BarberShop
          </Text>
        </View>


        <Text style={styles.authTitle}>
          Crie sua conta
        </Text>

        <Text style={styles.authSubtitle}>
          Cadastre-se para agendar seus cortes
        </Text>


        <View style={styles.divider} />


        <View style={styles.form}>

          <Text style={styles.label}>
            NOME COMPLETO
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor={
              COLORS.gray
            }
            value={nome}
            onChangeText={setNome}
          />


          <Text style={styles.label}>
            E-MAIL
          </Text>

          <TextInput
            style={styles.input}
            placeholder="seu@email.com"
            placeholderTextColor={
              COLORS.gray
            }
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />


          <Text style={styles.label}>
            SENHA
          </Text>

          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={
              COLORS.gray
            }
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />


          <Text style={styles.label}>
            CEP
          </Text>

          <TextInput
            style={styles.input}
            placeholder="00000-000"
            placeholderTextColor={
              COLORS.gray
            }
            value={cep}
            onChangeText={setCep}
            keyboardType="numeric"
          />


          <View style={styles.termsRow}>
            <View style={styles.checkBox}>
              <Text style={styles.checkText}>
                ✓
              </Text>
            </View>

            <Text style={styles.termsText}>
              Ao se cadastrar, você concorda
              com os{' '}
              <Text style={styles.yellowText}>
                Termos de Uso
              </Text>{' '}
              e a{' '}
              <Text style={styles.yellowText}>
                Política de Privacidade
              </Text>
            </Text>
          </View>


          <PrimaryButton
            title="Criar conta"
            onPress={handleCadastrar}
            loading={loading}
          />


          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>
              OU
            </Text>
            <View style={styles.orLine} />
          </View>


          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.bottomLink}>
              Já tem uma conta?{' '}
              <Text style={styles.yellowText}>
                Entrar
              </Text>
            </Text>
          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// 3. HOME
// ======================================================

function HomeScreen({
  route,
  navigation
}) {

  const user =
    route.params?.user || {
      nome: 'Cliente',
      id_usuario: 1
    };


  const [
    proximoAgendamento,
    setProximo
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const fetchAgendamentos =
    async () => {

      try {

        setLoading(true);

        const res =
          await fetch(
            `${API_URL}/agendamentos`
          );

        const data =
          await res.json();


        if (!Array.isArray(data)) {
          setProximo(null);
          return;
        }


        const meus =
          data.filter(
            item =>
              String(
                item.id_usuario
              ) ===
              String(
                user.id_usuario
              )
          );


        const ativos =
          meus.filter(
            item =>
              item.status !==
              'cancelado'
          );


        ativos.sort(
          (a, b) =>
            new Date(a.data) -
            new Date(b.data)
        );


        setProximo(
          ativos.length
            ? ativos[0]
            : null
        );


      } catch (error) {

        setProximo(null);

      } finally {

        setLoading(false);

      }
    };


  useFocusEffect(
    useCallback(() => {

      fetchAgendamentos();

    }, [user.id_usuario])
  );


  const dataFormatada =
    proximoAgendamento
      ? new Date(
          proximoAgendamento.data
        ).toLocaleDateString(
          'pt-BR',
          {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
          }
        )
      : '';


  const horaFormatada =
    proximoAgendamento
      ? new Date(
          proximoAgendamento.data
        ).toLocaleTimeString(
          'pt-BR',
          {
            hour: '2-digit',
            minute: '2-digit'
          }
        )
      : '';


  return (
    <SafeAreaView style={styles.screen}>

      <ScrollView
        contentContainerStyle={
          styles.homeContent
        }
      >

        {/* HEADER */}

        <View style={styles.homeHeader}>

          <View>

            <Text style={styles.welcome}>
              BEM-VINDO DE VOLTA
            </Text>

            <Text style={styles.homeName}>
              {user.nome || 'Cliente'}
            </Text>

          </View>


          <TouchableOpacity
            style={styles.notificationButton}
          >
            <Text style={styles.notificationIcon}>
              ♧
            </Text>
          </TouchableOpacity>

        </View>


        {/* PRÓXIMO AGENDAMENTO */}

        <View style={styles.homeAppointment}>

          <View style={styles.appointmentAccent} />

          <Text style={styles.appointmentLabel}>
            PRÓXIMO AGENDAMENTO
          </Text>


          {loading ? (

            <ActivityIndicator
              color={COLORS.yellow}
              style={{
                marginVertical: 30
              }}
            />

          ) : proximoAgendamento ? (

            <>

              <Text style={styles.appointmentBarber}>
                {proximoAgendamento.funcionario_nome ||
                  'Barbeiro'}
              </Text>


              <Text style={styles.appointmentService}>
                {proximoAgendamento
                  .servicos?.[0]?.nome ||
                  proximoAgendamento
                    .servico_nome ||
                  'Corte de cabelo'}
              </Text>


              <View style={styles.appointmentInfoRow}>

                <Text style={styles.appointmentInfo}>
                  📅 {dataFormatada}
                </Text>

                <Text style={styles.appointmentInfo}>
                  🕐 {horaFormatada}
                </Text>

              </View>


              <Text style={styles.appointmentPrice}>
                R${' '}
                {proximoAgendamento.valor_total
                  ? parseFloat(
                      proximoAgendamento.valor_total
                    ).toFixed(2)
                  : '0.00'}
              </Text>


              <TouchableOpacity
                style={styles.smallYellowButton}
                onPress={() =>
                  navigation.navigate(
                    'Agendamento',
                    { user }
                  )
                }
              >
                <Text style={styles.smallButtonText}>
                  Alterar
                </Text>
              </TouchableOpacity>

            </>

          ) : (

            <View style={styles.emptyAppointment}>

              <Text style={styles.emptyText}>
                Você não possui agendamentos.
              </Text>

              <TouchableOpacity
                style={styles.smallYellowButton}
                onPress={() =>
                  navigation.navigate(
                    'Agendamento',
                    { user }
                  )
                }
              >
                <Text style={styles.smallButtonText}>
                  Agendar agora
                </Text>
              </TouchableOpacity>

            </View>

          )}

        </View>


        {/* O QUE VOCÊ PRECISA? */}

        <SectionTitle>
          O que você precisa?
        </SectionTitle>


        <View style={styles.actionGrid}>

          <TouchableOpacity
            style={[
              styles.actionCard,
              styles.actionCardActive
            ]}
            onPress={() =>
              navigation.navigate(
                'Agendamento',
                { user }
              )
            }
          >

            <Text style={styles.actionIcon}>
              ✚
            </Text>

            <Text style={styles.actionTitle}>
              Agendar
            </Text>

            <Text style={styles.actionSubtitle}>
              Marque seu horário
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate(
                'Historico',
                { user }
              )
            }
          >

            <Text style={styles.actionIcon}>
              ◷
            </Text>

            <Text style={styles.actionTitle}>
              Histórico
            </Text>

            <Text style={styles.actionSubtitle}>
              Seus agendamentos
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate(
                'Agendamento',
                { user }
              )
            }
          >

            <Text style={styles.actionIcon}>
              ✂
            </Text>

            <Text style={styles.actionTitle}>
              Cabelo
            </Text>

            <Text style={styles.actionSubtitle}>
              Serviços disponíveis
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              navigation.navigate(
                'Agendamento',
                { user }
              )
            }
          >

            <Text style={styles.actionIcon}>
              ≋
            </Text>

            <Text style={styles.actionTitle}>
              Barba
            </Text>

            <Text style={styles.actionSubtitle}>
              Modelagem e aparo
            </Text>

          </TouchableOpacity>

        </View>


        {/* FIDELIDADE */}

        <SectionTitle>
          Programa de Fidelidade
        </SectionTitle>


        <TouchableOpacity
          style={styles.fidelityMiniCard}
          onPress={() =>
            navigation.navigate(
              'Fidelidade',
              { user }
            )
          }
        >

          <View style={styles.fidelityIconCircle}>
            <Text style={styles.fidelityIcon}>
              ★
            </Text>
          </View>

          <View style={{ flex: 1 }}>

            <View style={styles.pointsRow}>

              <Text style={styles.pointsValue}>
                320
              </Text>

              <Text style={styles.pointsUnit}>
                pts
              </Text>

              <Text style={styles.pointsGoal}>
                Meta: 500 pts
              </Text>

            </View>


            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: '64%'
                  }
                ]}
              />
            </View>


            <Text style={styles.pointsDescription}>
              Confira seus pontos e recompensas
            </Text>

          </View>

        </TouchableOpacity>


        {/* ESTILO */}

        <SectionTitle>
          Inspire-se
        </SectionTitle>


        <View style={styles.inspirationCard}>

          <Text style={styles.inspirationTitle}>
            Encontre seu estilo
          </Text>

          <Text style={styles.inspirationSubtitle}>
            Modelos de cortes e barbas
          </Text>

          <TouchableOpacity
            style={styles.inspirationButton}
            onPress={() =>
              navigation.navigate(
                'Agendamento',
                { user }
              )
            }
          >
            <Text style={styles.smallButtonText}>
              Ver modelos
            </Text>
          </TouchableOpacity>

        </View>


        {/* BARBEIROS */}

        <SectionTitle>
          Barbeiros disponíveis hoje
        </SectionTitle>


        <View style={styles.barbersRow}>

          {['Carlos', 'André', 'Diego'].map(
            (nome, index) => (

              <TouchableOpacity
                key={nome}
                style={styles.barberCard}
                onPress={() =>
                  navigation.navigate(
                    'Agendamento',
                    { user }
                  )
                }
              >

                <View style={styles.barberAvatar}>
                  <Text style={styles.barberAvatarText}>
                    {nome.charAt(0)}
                  </Text>
                </View>

                <Text style={styles.barberName}>
                  {nome}
                </Text>

                <Text style={styles.barberHours}>
                  {index === 0
                    ? '4 horários'
                    : index === 1
                    ? '2 horários'
                    : '6 horários'}
                </Text>

              </TouchableOpacity>

            )
          )}

        </View>

      </ScrollView>


      <BottomNav
        navigation={navigation}
        active="Home"
        user={user}
      />

    </SafeAreaView>
  );
}


// ======================================================
// 4. AGENDAMENTO
// ======================================================

function AgendamentoScreen({
  route,
  navigation
}) {

  const user =
    route.params?.user;


  const [
    servicos,
    setServicos
  ] = useState([]);


  const [
    funcionarios,
    setFuncionarios
  ] = useState([]);


  const [
    servicoSel,
    setServicoSel
  ] = useState(null);


  const [
    barbeiroSel,
    setBarbeiroSel
  ] = useState(null);


  const [
    data,
    setData
  ] = useState('2026-08-27');


  const [
    hora,
    setHora
  ] = useState('14:00');


  const [
    loading,
    setLoading
  ] = useState(false);


  useEffect(() => {

    carregarDados();

  }, []);


  const carregarDados =
    async () => {

      try {

        const [
          resS,
          resF
        ] = await Promise.all([

          fetch(
            `${API_URL}/servicos`
          ),

          fetch(
            `${API_URL}/funcionarios`
          )

        ]);


        const sData =
          await resS.json();

        const fData =
          await resF.json();


        setServicos(
          Array.isArray(sData)
            ? sData.filter(
                s => s.status == 1
              )
            : []
        );


        setFuncionarios(
          Array.isArray(fData)
            ? fData
            : []
        );


      } catch (error) {

        Alert.alert(
          'Erro',
          'Não foi possível carregar os serviços e profissionais.'
        );

      }
    };


  const handleConfirmar =
    async () => {

      if (!user) {

        Alert.alert(
          'Erro',
          'Faça login novamente.'
        );

        navigation.navigate('Login');

        return;
      }


      if (
        !servicoSel ||
        !barbeiroSel ||
        !data ||
        !hora
      ) {

        Alert.alert(
          'Atenção',
          'Selecione serviço, barbeiro, data e horário!'
        );

        return;
      }


      setLoading(true);


      try {

        const payload = {

          id_usuario:
            user.id_usuario,

          id_funcionario:
            barbeiroSel.id_funcionario,

          servicos: [
            {
              tipo_servico:
                servicoSel.id_servicos,

              valor:
                parseFloat(
                  servicoSel.preco
                )
            }
          ],

          data:
            `${data}T${hora}:00`,

          status:
            'agendado',

          forma_pagamento:
            'Pix'
        };


        const res =
          await fetch(
            `${API_URL}/agendamentos`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify(
                  payload
                )
            }
          );


        const resposta =
          await res.json();


        if (!res.ok) {

          Alert.alert(
            'Erro',
            resposta.error ||
            resposta.mensagem ||
            'Falha ao agendar.'
          );

          return;
        }


        Alert.alert(
          'Agendamento confirmado!',
          resposta.mensagem ||
          'Agendamento efetuado com sucesso!',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate(
                  'Home',
                  { user }
                )
            }
          ]
        );


      } catch (error) {

        Alert.alert(
          'Erro',
          'Erro ao conectar ao servidor.'
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <SafeAreaView style={styles.screen}>

      <ScrollView
        contentContainerStyle={
          styles.bookingContent
        }
      >

        <Text style={styles.pageTitle}>
          Agendar
        </Text>

        <Text style={styles.pageSubtitle}>
          Escolha o serviço, dia e horário
        </Text>


        {/* ETAPAS */}

        <View style={styles.stepsRow}>

          <View style={styles.stepActive}>
            <Text style={styles.stepNumber}>
              1
            </Text>
            <Text style={styles.stepTextActive}>
              Serviço
            </Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.stepActive}>
            <Text style={styles.stepNumber}>
              2
            </Text>
            <Text style={styles.stepTextActive}>
              Data
            </Text>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.step}>
            <Text style={styles.stepNumberInactive}>
              3
            </Text>
            <Text style={styles.stepText}>
              Barbeiro
            </Text>
          </View>

        </View>


        <SectionTitle>
          ESCOLHA O SERVIÇO
        </SectionTitle>


        {servicos.map(item => {

          const selected =
            servicoSel?.id_servicos ===
            item.id_servicos;


          return (
            <TouchableOpacity
              key={item.id_servicos}
              style={[
                styles.serviceCard,
                selected &&
                  styles.serviceCardSelected
              ]}
              onPress={() =>
                setServicoSel(item)
              }
            >

              <View style={styles.serviceIcon}>
                <Text style={styles.serviceIconText}>
                  ✂
                </Text>
              </View>


              <View style={styles.serviceInfo}>

                <Text style={styles.serviceName}>
                  {item.nome}
                </Text>

                <Text style={styles.serviceDescription}>
                  {item.duracao || '--'} min
                  {' · '}
                  +{item.pontos || 0} pts
                </Text>

              </View>


              <View style={styles.serviceRight}>

                <Text style={styles.servicePrice}>
                  R${' '}
                  {parseFloat(
                    item.preco || 0
                  ).toFixed(2)}
                </Text>

                {selected && (
                  <Text style={styles.selectedCheck}>
                    ✓
                  </Text>
                )}

              </View>

            </TouchableOpacity>
          );
        })}


        <SectionTitle>
          ESCOLHA O DIA
        </SectionTitle>


        <View style={styles.dateRow}>

          {[
            ['QUI', '27'],
            ['SEX', '28'],
            ['SÁB', '29'],
            ['DOM', '30']
          ].map((item, index) => {

            const day =
              `2026-08-${item[1]}`;

            const selected =
              data === day;


            return (
              <TouchableOpacity
                key={item[1]}
                style={[
                  styles.dateCard,
                  selected &&
                    styles.dateCardSelected
                ]}
                onPress={() =>
                  setData(day)
                }
              >

                <Text
                  style={[
                    styles.dateWeek,
                    selected &&
                      styles.dateWeekSelected
                  ]}
                >
                  {item[0]}
                </Text>

                <Text
                  style={[
                    styles.dateNumber,
                    selected &&
                      styles.dateNumberSelected
                  ]}
                >
                  {item[1]}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>


        <SectionTitle>
          HORÁRIOS DISPONÍVEIS
        </SectionTitle>


        <View style={styles.hoursGrid}>

          {[
            '09:00',
            '10:00',
            '11:00',
            '14:00',
            '15:00',
            '16:00'
          ].map(h => {

            const selected =
              hora === h;


            return (
              <TouchableOpacity
                key={h}
                style={[
                  styles.hourCard,
                  selected &&
                    styles.hourCardSelected
                ]}
                onPress={() =>
                  setHora(h)
                }
              >

                <Text
                  style={[
                    styles.hourText,
                    selected &&
                      styles.hourTextSelected
                  ]}
                >
                  {h}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>


        <SectionTitle>
          BARBEIROS DISPONÍVEIS
        </SectionTitle>


        <View style={styles.barbersBookingRow}>

          {funcionarios.map(item => {

            const selected =
              barbeiroSel?.id_funcionario ===
              item.id_funcionario;


            return (
              <TouchableOpacity
                key={item.id_funcionario}
                style={[
                  styles.bookingBarberCard,
                  selected &&
                    styles.bookingBarberSelected
                ]}
                onPress={() =>
                  setBarbeiroSel(item)
                }
              >

                <View style={styles.bookingAvatar}>
                  <Text style={styles.bookingAvatarText}>
                    {item.nome?.charAt(0) ||
                      'B'}
                  </Text>
                </View>

                <Text style={styles.bookingBarberName}>
                  {item.nome}
                </Text>

                <Text style={styles.bookingBarberFunction}>
                  {item.funcao ||
                    'Barbeiro'}
                </Text>

              </TouchableOpacity>
            );
          })}

        </View>


        {/* RESUMO */}

        <View style={styles.bookingSummary}>

          <View>

            <Text style={styles.summarySmall}>
              {servicoSel?.nome ||
                'Serviço não selecionado'}
            </Text>

            <Text style={styles.summaryMain}>
              {data} · {hora}
            </Text>

            <Text style={styles.summarySmall}>
              {barbeiroSel?.nome ||
                'Escolha um barbeiro'}
            </Text>

          </View>


          <Text style={styles.summaryPrice}>
            R${' '}
            {servicoSel?.preco
              ? parseFloat(
                  servicoSel.preco
                ).toFixed(2)
              : '0,00'}
          </Text>

        </View>


        <PrimaryButton
          title="Confirmar Agendamento"
          onPress={handleConfirmar}
          loading={loading}
        />

      </ScrollView>

    </SafeAreaView>
  );
}


// ======================================================
// 5. FIDELIDADE
// ======================================================

function FidelidadeScreen({
  route,
  navigation
}) {

  const user =
    route.params?.user;


  const [
    fidelidadeData,
    setFidelidadeData
  ] = useState(null);


  const [
    recompensas,
    setRecompensas
  ] = useState([]);


  const [
    comoGanhar,
    setComoGanhar
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    resgatandoId,
    setResgatandoId
  ] = useState(null);


useFocusEffect(
  useCallback(() => {

    let ativo = true;

    const atualizar = async () => {
      if (ativo) {
        await carregarDados();
      }
    };

    // Carrega imediatamente ao entrar
    atualizar();

    // Atualiza automaticamente a cada 3 segundos
    const intervalo = setInterval(() => {
      atualizar();
    }, 3000);

    // Para de atualizar quando sair da tela
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };

  }, [user?.id_usuario])
);


  const carregarDados =
    async () => {

      setLoading(true);

      try {

        const [
          resFid,
          resResgate,
          resServicos
        ] = await Promise.all([

          fetch(
            `${API_URL}/fidelidade/${user.id_usuario}`
          ),

          fetch(
            `${API_URL}/servicos/resgate`
          ),

          fetch(
            `${API_URL}/servicos`
          )

        ]);


        const dataFid =
          await resFid.json();

        const dataResgate =
          await resResgate.json();

        const dataServicos =
          await resServicos.json();


        setFidelidadeData(
          dataFid
        );


        setRecompensas(
          Array.isArray(
            dataResgate
          )
            ? dataResgate
            : []
        );


        setComoGanhar(
          Array.isArray(
            dataServicos
          )
            ? dataServicos.filter(
                s =>
                  (s.pontos || 0) > 0
              )
            : []
        );


      } catch (error) {

      } finally {

        setLoading(false);

      }
    };


  const pontos =
    fidelidadeData?.pontos
      ? parseInt(
          fidelidadeData.pontos
        )
      : 0;


  const totalGanho =
    fidelidadeData?.total_ganho
      ? parseInt(
          fidelidadeData.total_ganho
        )
      : pontos;


  const totalResgatado =
    fidelidadeData?.total_resgatado
      ? parseInt(
          fidelidadeData.total_resgatado
        )
      : 0;


  let restanteResgatado =
    totalResgatado;


  const recompensasOrdenadas =
    [...recompensas].sort(
      (a, b) =>
        parseInt(a.pontos_resgate) -
        parseInt(b.pontos_resgate)
    );


  const recompensasComStatus =
    recompensasOrdenadas.map(
      r => {

        const custo =
          parseInt(
            r.pontos_resgate
          );


        let status =
          'bloqueado';


        if (
          restanteResgatado >=
          custo
        ) {

          status =
            'resgatado';

          restanteResgatado -=
            custo;

        } else if (
          pontos >= custo
        ) {

          status =
            'disponivel';
        }


        return {
          ...r,
          custo,
          status
        };
      }
    );


  const proxima =
    recompensasComStatus.find(
      r =>
        r.status ===
        'bloqueado'
    );


  const progresso =
    proxima
      ? Math.min(
          100,
          (pontos /
            proxima.custo) *
            100
        )
      : 100;


  const faltam =
    proxima
      ? Math.max(
          0,
          proxima.custo -
            pontos
        )
      : 0;


  const tiers = [
    {
      nome: 'Bronze',
      min: 0,
      icone: '○'
    },
    {
      nome: 'Prata',
      min: 200,
      icone: '◇'
    },
    {
      nome: 'Ouro',
      min: 500,
      icone: '★'
    },
    {
      nome: 'Diamante',
      min: 1000,
      icone: '◆'
    }
  ];


  const tierAtual =
    [...tiers]
      .reverse()
      .find(
        t =>
          totalGanho >=
          t.min
      )?.nome ||
    'Bronze';


  const handleResgatar =
    (
      idServico,
      nomeServico,
      custo
    ) => {

      Alert.alert(
        'Confirmar resgate',
        `Trocar ${custo} pontos por "${nomeServico}"?`,
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },

          {
            text: 'Resgatar',

            onPress: async () => {

              setResgatandoId(
                idServico
              );


              try {

                const res =
                  await fetch(
                    `${API_URL}/fidelidade/resgatar`,
                    {
                      method:
                        'POST',

                      headers: {
                        'Content-Type':
                          'application/json'
                      },

                      body:
                        JSON.stringify({
                          id_usuario:
                            user.id_usuario,

                          id_servico:
                            idServico
                        })
                    }
                  );


                const data =
                  await res.json();


                if (!res.ok) {

                  Alert.alert(
                    'Erro',
                    data.error ||
                    'Não foi possível resgatar.'
                  );

                  return;
                }


                Alert.alert(
                  'Sucesso!',
                  data.mensagem
                );


                carregarDados();


              } catch (error) {

                Alert.alert(
                  'Erro',
                  'Conexão indisponível.'
                );

              } finally {

                setResgatandoId(
                  null
                );
              }
            }
          }
        ]
      );
    };


  if (loading) {

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerLoading}>
          <ActivityIndicator
            color={COLORS.yellow}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.screen}>

      <ScrollView
        contentContainerStyle={
          styles.fidelityContent
        }
      >

        <Text style={styles.pageTitle}>
          Fidelidade
        </Text>


        {/* PONTOS */}

        <View style={styles.pointsCard}>

          <View style={styles.pointsHeader}>

            <View>

              <Text style={styles.pointsLabel}>
                SEUS PONTOS
              </Text>

              <Text style={styles.bigPoints}>
                {pontos}
                <Text style={styles.pts}>
                  {' '}pts
                </Text>
              </Text>

            </View>


            <View style={styles.medalCircle}>
              <Text style={styles.medal}>
                ★
              </Text>
            </View>

          </View>


          {proxima && (
            <>

              <View style={styles.progressHeader}>

                <Text style={styles.grayText}>
                  Próxima recompensa
                </Text>

                <Text style={styles.yellowText}>
                  {pontos}/{proxima.custo} pts
                </Text>

              </View>


              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width:
                        `${progresso}%`
                    }
                  ]}
                />
              </View>


              <Text style={styles.grayText}>
                Faltam{' '}
                <Text style={styles.whiteBold}>
                  {faltam} pontos
                </Text>{' '}
                para {proxima.nome}
              </Text>

            </>
          )}

        </View>


        {/* NÍVEIS */}

        <View style={styles.tiersRow}>

          {tiers.map(t => {

            const ativo =
              tierAtual ===
              t.nome;


            return (
              <View
                key={t.nome}
                style={[
                  styles.tier,
                  ativo &&
                    styles.tierActive
                ]}
              >

                <Text
                  style={[
                    styles.tierIcon,
                    ativo &&
                      styles.yellowText
                  ]}
                >
                  {t.icone}
                </Text>

                <Text
                  style={[
                    styles.tierText,
                    ativo &&
                      styles.yellowText
                  ]}
                >
                  {t.nome}
                </Text>

              </View>
            );
          })}

        </View>


        <SectionTitle>
          RECOMPENSAS
        </SectionTitle>


        {recompensasComStatus.map(
          (r, index) => (

            <View
              key={r.id_servicos}
              style={styles.rewardRow}
            >

              <View
                style={[
                  styles.rewardCircle,
                  r.status ===
                    'resgatado' &&
                    styles.rewardDone,

                  r.status ===
                    'disponivel' &&
                    styles.rewardAvailable
                ]}
              >

                <Text style={styles.rewardIcon}>
                  {r.status ===
                    'resgatado'
                    ? '✓'
                    : r.status ===
                      'disponivel'
                    ? '🎁'
                    : '🔒'}
                </Text>

              </View>


              <View style={styles.rewardInfo}>

                <Text
                  style={[
                    styles.rewardName,
                    r.status ===
                      'resgatado' &&
                      styles.rewardDoneText
                  ]}
                >
                  {r.nome}
                </Text>

                <Text style={styles.rewardPoints}>
                  {r.custo} pontos
                </Text>

              </View>


              {r.status ===
                'resgatado' && (

                <View style={styles.doneTag}>
                  <Text style={styles.doneTagText}>
                    Resgatado
                  </Text>
                </View>
              )}


              {r.status ===
                'disponivel' && (

                <TouchableOpacity
                  style={styles.redeemButton}
                  disabled={
                    resgatandoId ===
                    r.id_servicos
                  }
                  onPress={() =>
                    handleResgatar(
                      r.id_servicos,
                      r.nome,
                      r.custo
                    )
                  }
                >

                  {resgatandoId ===
                  r.id_servicos ? (

                    <ActivityIndicator
                      color="#111"
                      size="small"
                    />

                  ) : (

                    <Text
                      style={
                        styles.redeemText
                      }
                    >
                      Resgatar
                    </Text>
                  )}

                </TouchableOpacity>
              )}


              {r.status ===
                'bloqueado' && (

                <View style={styles.nextTag}>
                  <Text style={styles.nextTagText}>
                    {proxima?.id_servicos ===
                    r.id_servicos
                      ? 'Próximo'
                      : 'Bloqueado'}
                  </Text>
                </View>
              )}

            </View>
          )
        )}


        {/* COMO GANHAR */}

        <View style={styles.howToCard}>

          <Text style={styles.howToTitle}>
            Como ganhar pontos
          </Text>


          {comoGanhar.map(s => (

            <View
              key={s.id_servicos}
              style={styles.howToRow}
            >

              <View style={styles.smallIconBox}>
                <Text style={styles.smallIcon}>
                  ✂
                </Text>
              </View>

              <Text style={styles.howToName}>
                {s.nome}
              </Text>

              <Text style={styles.howToPoints}>
                +{s.pontos} pts
              </Text>

            </View>
          ))}

        </View>


        {/* HISTÓRICO DE PONTOS */}

        <SectionTitle>
          HISTÓRICO DE PONTOS
        </SectionTitle>


        {fidelidadeData?.historico?.map(
          (h, index) => (

            <View
              key={index}
              style={styles.pointHistory}
            >

              <View style={styles.smallIconBox}>
                <Text style={styles.smallIcon}>
                  ✂
                </Text>
              </View>


              <View style={{ flex: 1 }}>

                <Text style={styles.historyName}>
                  {h.descricao ||
                    'Pontuação'}
                </Text>

                <Text style={styles.historyDate}>
                  {h.data
                    ? new Date(
                        h.data
                      ).toLocaleDateString(
                        'pt-BR'
                      )
                    : ''}
                </Text>

              </View>


              <Text
                style={[
                  styles.historyPoints,
                  {
                    color:
                      h.tipo === 'ganho'
                        ? COLORS.green
                        : COLORS.red
                  }
                ]}
              >
                {h.tipo === 'ganho'
                  ? '+'
                  : '-'}
                {h.pontos} pts
              </Text>

            </View>
          )
        )}

      </ScrollView>


      <BottomNav
        navigation={navigation}
        active="Fidelidade"
        user={user}
      />

    </SafeAreaView>
  );
}


// ======================================================
// 6. HISTÓRICO
// ======================================================

function HistoricoScreen({
  route,
  navigation
}) {

  const user =
    route.params?.user;


  const [
    historico,
    setHistorico
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const fetchHistorico =
    async () => {

      try {

        setLoading(true);


        const res =
          await fetch(
            `${API_URL}/agendamentos`
          );


        const data =
          await res.json();


        if (!Array.isArray(data)) {

          setHistorico([]);

          return;
        }


        const meus =
          data.filter(
            item =>
              String(
                item.id_usuario
              ) ===
              String(
                user.id_usuario
              )
          );


        meus.sort(
          (a, b) =>
            new Date(b.data) -
            new Date(a.data)
        );


        setHistorico(meus);


      } catch (error) {

        setHistorico([]);

      } finally {

        setLoading(false);

      }
    };


useFocusEffect(
  useCallback(() => {

    let ativo = true;

    const atualizar = async () => {
      if (ativo) {
        await fetchHistorico();
      }
    };

    // Carrega imediatamente
    atualizar();

    // Atualiza a cada 3 segundos
    const intervalo = setInterval(() => {
      atualizar();
    }, 3000);

    // Para ao sair da tela
    return () => {
      ativo = false;
      clearInterval(intervalo);
    };

  }, [user?.id_usuario])
);


  const cortes =
    historico.filter(
      item =>
        item.status ===
        'concluido'
    );


  const barbeiros =
    new Set(
      historico.map(
        item =>
          item.funcionario_nome
      )
    );


  const totalGasto =
    cortes.reduce(
      (total, item) =>
        total +
        parseFloat(
          item.valor_total || 0
        ),
      0
    );


  if (loading) {

    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.centerLoading}>
          <ActivityIndicator
            color={COLORS.yellow}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.screen}>

      <FlatList
        data={historico}
        keyExtractor={(
          item,
          index
        ) =>
          String(
            item.id ||
            index
          )
        }
        contentContainerStyle={
          styles.historyContent
        }


        ListHeaderComponent={

          <>

            <Text style={styles.pageTitle}>
              Histórico
            </Text>


            {/* ESTATÍSTICAS */}

            <View style={styles.statsRow}>

              <View style={styles.statCard}>

                <Text style={styles.statIcon}>
                  ✂
                </Text>

                <Text style={styles.statNumber}>
                  {cortes.length}
                </Text>

                <Text style={styles.statLabel}>
                  Cortes
                </Text>

              </View>


              <View style={styles.statCard}>

                <Text style={styles.statIcon}>
                  ≋
                </Text>

                <Text style={styles.statNumber}>
                  {barbeiros.size}
                </Text>

                <Text style={styles.statLabel}>
                  Barbeiros
                </Text>

              </View>


              <View style={styles.statCard}>

                <Text style={styles.statIcon}>
                  $
                </Text>

                <Text style={styles.statNumberSmall}>
                  R${' '}
                  {totalGasto.toFixed(0)}
                </Text>

                <Text style={styles.statLabel}>
                  Total gasto
                </Text>

              </View>

            </View>


            <SectionTitle>
              AGENDAMENTOS
            </SectionTitle>

          </>
        }


        ListEmptyComponent={

          <View style={styles.emptyHistory}>

            <Text style={styles.emptyHistoryIcon}>
              ◷
            </Text>

            <Text style={styles.emptyHistoryTitle}>
              Nenhum agendamento
            </Text>

            <Text style={styles.emptyHistoryText}>
              Seus cortes aparecerão aqui.
            </Text>

          </View>
        }


        renderItem={({
          item
        }) => (

          <View style={styles.historyCard}>

            <View style={styles.historyTop}>

              <View style={styles.historyServiceIcon}>
                <Text style={styles.historyServiceIconText}>
                  ✂
                </Text>
              </View>


              <View style={{ flex: 1 }}>

                <Text style={styles.historyService}>
                  {item.servicos?.[0]?.nome ||
                    item.servico_nome ||
                    'Corte de Cabelo'}
                </Text>

                <Text style={styles.historyBarber}>
                  {item.funcionario_nome ||
                    'Barbeiro'}
                </Text>

              </View>


              <Text style={styles.historyPrice}>
                R${' '}
                {item.valor_total
                  ? parseFloat(
                      item.valor_total
                    ).toFixed(2)
                  : '0.00'}
              </Text>

            </View>


            <View style={styles.historyDetails}>

              <Text style={styles.historyDetail}>
                📅{' '}
                {item.data
                  ? new Date(
                      item.data
                    ).toLocaleDateString(
                      'pt-BR'
                    )
                  : '--'}
              </Text>

              <Text style={styles.historyDetail}>
                🕐{' '}
                {item.data
                  ? new Date(
                      item.data
                    ).toLocaleTimeString(
                      'pt-BR',
                      {
                        hour:
                          '2-digit',
                        minute:
                          '2-digit'
                      }
                    )
                  : '--:--'}
              </Text>

            </View>


            <View style={styles.historyBottom}>

              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      item.status ===
                      'concluido'
                        ? COLORS.green
                        : item.status ===
                          'cancelado'
                        ? COLORS.red
                        : COLORS.yellow
                  }
                ]}
              >
                ●{' '}
                {item.status ||
                  'agendado'}
              </Text>


              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() =>
                  navigation.navigate(
                    'Agendamento',
                    { user }
                  )
                }
              >
                <Text style={styles.outlineText}>
                  Reagendar
                </Text>
              </TouchableOpacity>

            </View>

          </View>
        )}
      />


      <BottomNav
        navigation={navigation}
        active="Historico"
        user={user}
      />

    </SafeAreaView>
  );
}


// ======================================================
// PRIMEIRO ACESSO
// ======================================================

function PrimeiroAcessoScreen({
  route,
  navigation
}) {

  const id_usuario =
    route.params?.id_usuario;


  const [senha, setSenha] =
    useState('');

  const [loading, setLoading] =
    useState(false);


  const salvarSenha =
    async () => {

      if (!senha.trim()) {

        Alert.alert(
          'Atenção',
          'Digite uma senha.'
        );

        return;
      }


      setLoading(true);

      try {

        const response =
          await fetch(
            `${API_URL}/atualizar`,
            {
              method: 'PUT',

              headers: {
                'Content-Type':
                  'application/json'
              },

              body:
                JSON.stringify({
                  id_usuario,
                  nome_completo: '',
                  cep: '',
                  email: '',
                  senha:
                    senha.trim()
                })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          Alert.alert(
            'Erro',
            data.error ||
            'Não foi possível atualizar a senha.'
          );

          return;
        }


        Alert.alert(
          'Sucesso',
          'Senha cadastrada. Faça login novamente.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate(
                  'Login'
                )
            }
          ]
        );


      } catch (error) {

        Alert.alert(
          'Erro',
          'Erro de conexão.'
        );

      } finally {

        setLoading(false);

      }
    };


  return (
    <SafeAreaView style={styles.screen}>

      <View style={styles.authContainer}>

        <Logo />

        <Text style={styles.authTitle}>
          Primeiro acesso
        </Text>

        <Text style={styles.authSubtitle}>
          Cadastre sua senha para continuar.
        </Text>


        <Text style={styles.label}>
          NOVA SENHA
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor={
            COLORS.gray
          }
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />


        <PrimaryButton
          title="Salvar senha"
          onPress={salvarSenha}
          loading={loading}
        />

      </View>

    </SafeAreaView>
  );
}


// ======================================================
// NAVEGAÇÃO INFERIOR
// ======================================================

function BottomNav({
  navigation,
  active,
  user
}) {

  const item = (
    name,
    icon,
    screen
  ) => {

    const selected =
      active === name;


    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => {

          if (screen === 'Home') {

            navigation.navigate(
              'Home',
              { user }
            );

          } else {

            navigation.navigate(
              screen,
              { user }
            );
          }
        }}
      >

        <Text
          style={[
            styles.navIcon,
            selected &&
              styles.navIconActive
          ]}
        >
          {icon}
        </Text>

        <Text
          style={[
            styles.navText,
            selected &&
              styles.navTextActive
          ]}
        >
          {name}
        </Text>

      </TouchableOpacity>
    );
  };


  return (
    <View style={styles.bottomNav}>

      {item(
        'Home',
        '⌂',
        'Home'
      )}

      {item(
        'Agendar',
        '□',
        'Agendamento'
      )}

      {item(
        'Histórico',
        '◷',
        'Historico'
      )}

      {item(
        'Fidelidade',
        '☆',
        'Fidelidade'
      )}

      {item(
        'Perfil',
        '♙',
        'Login'
      )}

    </View>
  );
}


// ======================================================
// APP
// ======================================================

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor:
              COLORS.bg
          },

          headerTintColor:
            COLORS.white,

          headerTitleStyle: {
            fontWeight:
              '700'
          },

          contentStyle: {
            backgroundColor:
              COLORS.bg
          }
        }}
      >

        <Stack.Screen
          name="Login"
          component={
            LoginScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="Cadastro"
          component={
            CadastroScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="PrimeiroAcesso"
          component={
            PrimeiroAcessoScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="Home"
          component={
            HomeScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="Agendamento"
          component={
            AgendamentoScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="Fidelidade"
          component={
            FidelidadeScreen
          }
          options={{
            headerShown:
              false
          }}
        />


        <Stack.Screen
          name="Historico"
          component={
            HistoricoScreen
          }
          options={{
            headerShown:
              false
          }}
        />

      </Stack.Navigator>

    </NavigationContainer>
  );
}


// ======================================================
// ESTILOS
// ======================================================

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.bg
  },


  // ----------------------------
  // AUTH
  // ----------------------------

  authContainer: {
    flexGrow: 1,
    padding: 28,
    justifyContent:
      'center'
  },


  authHeader: {
    alignItems:
      'center',
    marginBottom:
      30
  },


  logoBadge: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor:
      COLORS.yellow,
    justifyContent:
      'center',
    alignItems:
      'center'
  },


  logoIcon: {
    fontSize: 42,
    color:
      '#111111',
    fontWeight:
      'bold'
  },


  brand: {
    color:
      COLORS.white,
    fontSize: 30,
    fontWeight:
      '800',
    marginTop: 14,
    letterSpacing: 0.5
  },


  authTitle: {
    color:
      COLORS.white,
    fontSize: 32,
    fontWeight:
      '800',
    marginTop: 30
  },


  authSubtitle: {
    color:
      COLORS.gray,
    fontSize: 16,
    marginTop: 8,
    marginBottom: 24
  },


  form: {
    width: '100%'
  },


  label: {
    color:
      COLORS.gray,
    fontSize: 13,
    fontWeight:
      '700',
    letterSpacing: 1.1,
    marginTop: 18,
    marginBottom: 9
  },


  input: {
    height: 60,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    paddingHorizontal: 18,
    color:
      COLORS.white,
    fontSize: 16
  },


  primaryButton: {
    height: 62,
    backgroundColor:
      COLORS.yellow,
    borderRadius: 19,
    alignItems:
      'center',
    justifyContent:
      'center',
    marginTop: 26
  },


  primaryButtonText: {
    color:
      '#111111',
    fontSize: 17,
    fontWeight:
      '800'
  },


  forgotButton: {
    alignItems:
      'flex-end',
    marginTop: 12
  },


  yellowText: {
    color:
      COLORS.yellow,
    fontWeight:
      '700'
  },


  divider: {
    height: 1,
    backgroundColor:
      COLORS.border,
    marginVertical: 5
  },


  termsRow: {
    flexDirection:
      'row',
    alignItems:
      'flex-start',
    marginTop: 24
  },


  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor:
      COLORS.yellow,
    alignItems:
      'center',
    justifyContent:
      'center',
    marginRight: 12
  },


  checkText: {
    color:
      '#111111',
    fontWeight:
      '900'
  },


  termsText: {
    flex: 1,
    color:
      COLORS.gray,
    fontSize: 13,
    lineHeight: 20
  },


  orContainer: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginVertical: 26
  },


  orLine: {
    flex: 1,
    height: 1,
    backgroundColor:
      COLORS.border
  },


  orText: {
    color:
      COLORS.gray,
    marginHorizontal: 14
  },


  bottomLink: {
    textAlign:
      'center',
    color:
      COLORS.gray,
    fontSize: 15
  },


  // ----------------------------
  // HOME
  // ----------------------------

  homeContent: {
    padding: 22,
    paddingBottom: 120
  },


  homeHeader: {
    flexDirection:
      'row',
    justifyContent:
      'space-between',
    alignItems:
      'center',
    marginBottom: 24
  },


  welcome: {
    color:
      COLORS.gray,
    fontSize: 11,
    letterSpacing: 2,
    fontWeight:
      '600'
  },


  homeName: {
    color:
      COLORS.white,
    fontSize: 30,
    fontWeight:
      '800',
    marginTop: 5
  },


  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    justifyContent:
      'center',
    alignItems:
      'center'
  },


  notificationIcon: {
    color:
      COLORS.white,
    fontSize: 24
  },


  homeAppointment: {
    backgroundColor:
      COLORS.blueCard,
    borderRadius: 28,
    padding: 24,
    overflow: 'hidden',
    marginBottom: 10
  },


  appointmentAccent: {
    position:
      'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor:
      COLORS.yellow
  },


  appointmentLabel: {
    color:
      COLORS.yellow,
    fontSize: 12,
    fontWeight:
      '800',
    letterSpacing: 1.8
  },


  appointmentBarber: {
    color:
      COLORS.white,
    fontSize: 24,
    fontWeight:
      '800',
    marginTop: 18
  },


  appointmentService: {
    color:
      '#C9D5EA',
    fontSize: 17,
    marginTop: 4
  },


  appointmentInfoRow: {
    flexDirection:
      'row',
    gap: 20,
    marginTop: 20
  },


  appointmentInfo: {
    color:
      '#D5DDEC',
    fontSize: 13
  },


  appointmentPrice: {
    color:
      COLORS.yellow,
    fontSize: 25,
    fontWeight:
      '800',
    marginTop: 16
  },


  smallYellowButton: {
    alignSelf:
      'flex-start',
    backgroundColor:
      COLORS.yellow,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 16
  },


  smallButtonText: {
    color:
      '#111111',
    fontWeight:
      '800',
    fontSize: 14
  },


  emptyAppointment: {
    alignItems:
      'flex-start'
  },


  emptyText: {
    color:
      COLORS.gray,
    marginTop: 15
  },


  sectionTitle: {
    color:
      COLORS.white,
    fontSize: 19,
    fontWeight:
      '800',
    marginTop: 28,
    marginBottom: 15
  },


  actionGrid: {
    flexDirection:
      'row',
    flexWrap:
      'wrap',
    gap: 12
  },


  actionCard: {
    width: '48%',
    minHeight: 150,
    backgroundColor:
      COLORS.card,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor:
      COLORS.border
  },


  actionCardActive: {
    backgroundColor:
      '#07366D',
    borderColor:
      '#07366D'
  },


  actionIcon: {
    color:
      COLORS.yellow,
    fontSize: 28,
    marginBottom: 18
  },


  actionTitle: {
    color:
      COLORS.white,
    fontSize: 17,
    fontWeight:
      '800'
  },


  actionSubtitle: {
    color:
      COLORS.gray,
    fontSize: 13,
    marginTop: 6
  },


  fidelityMiniCard: {
    flexDirection:
      'row',
    alignItems:
      'center',
    backgroundColor:
      COLORS.card,
    borderRadius: 25,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 18
  },


  fidelityIconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor:
      COLORS.yellow,
    alignItems:
      'center',
    justifyContent:
      'center',
    marginRight: 16
  },


  fidelityIcon: {
    color:
      '#111111',
    fontSize: 30
  },


  pointsRow: {
    flexDirection:
      'row',
    alignItems:
      'baseline'
  },


  pointsValue: {
    color:
      COLORS.white,
    fontSize: 26,
    fontWeight:
      '800'
  },


  pointsUnit: {
    color:
      COLORS.yellow,
    fontSize: 15,
    fontWeight:
      '700',
    marginLeft: 5
  },


  pointsGoal: {
    color:
      COLORS.gray,
    fontSize: 12,
    marginLeft: 'auto'
  },


  progressBackground: {
    height: 8,
    backgroundColor:
      '#353535',
    borderRadius: 4,
    overflow:
      'hidden',
    marginTop: 9
  },


  progressBar: {
    height: 8,
    backgroundColor:
      COLORS.yellow,
    borderRadius: 4
  },


  pointsDescription: {
    color:
      COLORS.gray,
    fontSize: 12,
    marginTop: 7
  },


  inspirationCard: {
    height: 180,
    borderRadius: 25,
    backgroundColor:
      '#272727',
    padding: 22,
    justifyContent:
      'flex-end',
    overflow:
      'hidden'
  },


  inspirationTitle: {
    color:
      COLORS.white,
    fontSize: 22,
    fontWeight:
      '800'
  },


  inspirationSubtitle: {
    color:
      COLORS.gray,
    fontSize: 14,
    marginTop: 5
  },


  inspirationButton: {
    position:
      'absolute',
    right: 18,
    bottom: 20,
    backgroundColor:
      COLORS.yellow,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 11
  },


  barbersRow: {
    flexDirection:
      'row',
    gap: 10
  },


  barberCard: {
    flex: 1,
    backgroundColor:
      COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    alignItems:
      'center',
    padding: 15
  },


  barberAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor:
      COLORS.yellow,
    alignItems:
      'center',
    justifyContent:
      'center'
  },


  barberAvatarText: {
    color:
      '#111111',
    fontSize: 23,
    fontWeight:
      '800'
  },


  barberName: {
    color:
      COLORS.white,
    fontWeight:
      '800',
    marginTop: 10
  },


  barberHours: {
    color:
      COLORS.yellow,
    fontSize: 11,
    marginTop: 5
  },


  // ----------------------------
  // AGENDAMENTO
  // ----------------------------

  bookingContent: {
    padding: 22,
    paddingBottom: 40
  },


  pageTitle: {
    color:
      COLORS.white,
    fontSize: 30,
    fontWeight:
      '800'
  },


  pageSubtitle: {
    color:
      COLORS.gray,
    fontSize: 14,
    marginTop: 5
  },


  stepsRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginTop: 25,
    marginBottom: 15
  },


  stepActive: {
    alignItems:
      'center'
  },


  step: {
    alignItems:
      'center'
  },


  stepNumber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor:
      COLORS.yellow,
    color:
      '#111111',
    textAlign:
      'center',
    textAlignVertical:
      'center',
    paddingTop: 8,
    fontWeight:
      '800'
  },


  stepNumberInactive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor:
      COLORS.card2,
    color:
      COLORS.gray,
    textAlign:
      'center',
    textAlignVertical:
      'center',
    paddingTop: 8,
    fontWeight:
      '800'
  },


  stepTextActive: {
    color:
      COLORS.yellow,
    fontSize: 11,
    marginTop: 5
  },


  stepText: {
    color:
      COLORS.gray,
    fontSize: 11,
    marginTop: 5
  },


  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor:
      COLORS.border,
    marginHorizontal: 7,
    marginBottom: 17
  },


  serviceCard: {
    flexDirection:
      'row',
    alignItems:
      'center',
    backgroundColor:
      COLORS.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    padding: 15,
    marginBottom: 10
  },


  serviceCardSelected: {
    borderColor:
      COLORS.yellow
  },


  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 17,
    backgroundColor:
      '#303030',
    justifyContent:
      'center',
    alignItems:
      'center'
  },


  serviceIconText: {
    color:
      COLORS.yellow,
    fontSize: 28
  },


  serviceInfo: {
    flex: 1,
    marginLeft: 14
  },


  serviceName: {
    color:
      COLORS.white,
    fontSize: 16,
    fontWeight:
      '800'
  },


  serviceDescription: {
    color:
      COLORS.gray,
    fontSize: 12,
    marginTop: 5
  },


  serviceRight: {
    alignItems:
      'flex-end'
  },


  servicePrice: {
    color:
      COLORS.yellow,
    fontSize: 16,
    fontWeight:
      '800'
  },


  selectedCheck: {
    color:
      COLORS.yellow,
    fontSize: 20,
    marginTop: 5
  },


  dateRow: {
    flexDirection:
      'row',
    gap: 10
  },


  dateCard: {
    flex: 1,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    paddingVertical: 15,
    alignItems:
      'center'
  },


  dateCardSelected: {
    backgroundColor:
      COLORS.yellow,
    borderColor:
      COLORS.yellow
  },


  dateWeek: {
    color:
      COLORS.gray,
    fontSize: 11,
    fontWeight:
      '700'
  },


  dateWeekSelected: {
    color:
      '#111111'
  },


  dateNumber: {
    color:
      COLORS.white,
    fontSize: 20,
    fontWeight:
      '800',
    marginTop: 5
  },


  dateNumberSelected: {
    color:
      '#111111'
  },


  hoursGrid: {
    flexDirection:
      'row',
    flexWrap:
      'wrap',
    gap: 10
  },


  hourCard: {
    width: '31%',
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 15,
    paddingVertical: 15,
    alignItems:
      'center'
  },


  hourCardSelected: {
    backgroundColor:
      COLORS.yellow,
    borderColor:
      COLORS.yellow
  },


  hourText: {
    color:
      COLORS.white,
    fontSize: 15,
    fontWeight:
      '700'
  },


  hourTextSelected: {
    color:
      '#111111'
  },


  barbersBookingRow: {
    flexDirection:
      'row',
    gap: 10
  },


  bookingBarberCard: {
    flex: 1,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 20,
    padding: 13,
    alignItems:
      'center'
  },


  bookingBarberSelected: {
    borderColor:
      COLORS.yellow
  },


  bookingAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor:
      COLORS.yellow,
    alignItems:
      'center',
    justifyContent:
      'center'
  },


  bookingAvatarText: {
    color:
      '#111111',
    fontSize: 23,
    fontWeight:
      '800'
  },


  bookingBarberName: {
    color:
      COLORS.white,
    fontSize: 13,
    fontWeight:
      '800',
    marginTop: 9,
    textAlign:
      'center'
  },


  bookingBarberFunction: {
    color:
      COLORS.gray,
    fontSize: 10,
    marginTop: 4,
    textAlign:
      'center'
  },


  bookingSummary: {
    backgroundColor:
      COLORS.blueCard,
    borderRadius: 22,
    padding: 18,
    marginTop: 25,
    flexDirection:
      'row',
    justifyContent:
      'space-between',
    alignItems:
      'center'
  },


  summarySmall: {
    color:
      '#B8C8E4',
    fontSize: 12
  },


  summaryMain: {
    color:
      COLORS.white,
    fontSize: 15,
    fontWeight:
      '800',
    marginVertical: 4
  },


  summaryPrice: {
    color:
      COLORS.yellow,
    fontSize: 22,
    fontWeight:
      '800'
  },


  // ----------------------------
  // FIDELIDADE
  // ----------------------------

  fidelityContent: {
    padding: 22,
    paddingBottom: 110
  },


  pointsCard: {
    backgroundColor:
      COLORS.blueCard,
    borderRadius: 27,
    padding: 22,
    marginTop: 22
  },


  pointsHeader: {
    flexDirection:
      'row',
    justifyContent:
      'space-between'
  },


  pointsLabel: {
    color:
      '#B8C8E4',
    fontSize: 11,
    fontWeight:
      '700',
    letterSpacing: 1
  },


  bigPoints: {
    color:
      COLORS.yellow,
    fontSize: 48,
    fontWeight:
      '800',
    marginTop: 4
  },


  pts: {
    color:
      '#B8C8E4',
    fontSize: 15
  },


  medalCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor:
      COLORS.yellow,
    alignItems:
      'center',
    justifyContent:
      'center'
  },


  medal: {
    color:
      '#111111',
    fontSize: 30
  },


  progressHeader: {
    flexDirection:
      'row',
    justifyContent:
      'space-between',
    marginTop: 25,
    marginBottom: 7
  },


  grayText: {
    color:
      COLORS.gray,
    fontSize: 12
  },


  whiteBold: {
    color:
      COLORS.white,
    fontWeight:
      '800'
  },


  tiersRow: {
    flexDirection:
      'row',
    gap: 8,
    marginTop: 14
  },


  tier: {
    flex: 1,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 16,
    alignItems:
      'center',
    paddingVertical: 14
  },


  tierActive: {
    borderColor:
      COLORS.yellow
  },


  tierIcon: {
    color:
      COLORS.gray,
    fontSize: 22
  },


  tierText: {
    color:
      COLORS.gray,
    fontSize: 11,
    fontWeight:
      '700',
    marginTop: 5
  },


  rewardRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginBottom: 13
  },


  rewardCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      COLORS.card2,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    alignItems:
      'center',
    justifyContent:
      'center'
  },


  rewardDone: {
    backgroundColor:
      COLORS.yellow,
    borderColor:
      COLORS.yellow
  },


  rewardAvailable: {
    borderColor:
      COLORS.yellow
  },


  rewardIcon: {
    fontSize: 16
  },


  rewardInfo: {
    flex: 1,
    marginLeft: 13
  },


  rewardName: {
    color:
      COLORS.white,
    fontSize: 15,
    fontWeight:
      '700'
  },


  rewardDoneText: {
    color:
      COLORS.gray
  },


  rewardPoints: {
    color:
      COLORS.gray,
    fontSize: 12,
    marginTop: 3
  },


  doneTag: {
    backgroundColor:
      '#1C3A2D',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 7
  },


  doneTagText: {
    color:
      COLORS.green,
    fontSize: 11,
    fontWeight:
      '700'
  },


  redeemButton: {
    backgroundColor:
      COLORS.yellow,
    borderRadius: 15,
    paddingHorizontal: 13,
    paddingVertical: 8
  },


  redeemText: {
    color:
      '#111111',
    fontWeight:
      '800',
    fontSize: 11
  },


  nextTag: {
    borderWidth: 1,
    borderColor:
      COLORS.yellow,
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 7
  },


  nextTagText: {
    color:
      COLORS.yellow,
    fontSize: 11,
    fontWeight:
      '700'
  },


  howToCard: {
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 22,
    padding: 18,
    marginTop: 18
  },


  howToTitle: {
    color:
      COLORS.white,
    fontSize: 17,
    fontWeight:
      '800',
    marginBottom: 14
  },


  howToRow: {
    flexDirection:
      'row',
    alignItems:
      'center',
    marginVertical: 7
  },


  smallIconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor:
      COLORS.card2,
    justifyContent:
      'center',
    alignItems:
      'center'
  },


  smallIcon: {
    color:
      COLORS.yellow,
    fontSize: 19
  },


  howToName: {
    flex: 1,
    color:
      COLORS.white,
    marginLeft: 12,
    fontSize: 14
  },


  howToPoints: {
    color:
      COLORS.yellow,
    fontWeight:
      '800'
  },


  pointHistory: {
    flexDirection:
      'row',
    alignItems:
      'center',
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 17,
    padding: 13,
    marginBottom: 9
  },


  historyName: {
    color:
      COLORS.white,
    fontWeight:
      '700'
  },


  historyDate: {
    color:
      COLORS.gray,
    fontSize: 11,
    marginTop: 3
  },


  historyPoints: {
    fontWeight:
      '800'
  },


  // ----------------------------
  // HISTÓRICO
  // ----------------------------

  historyContent: {
    padding: 22,
    paddingBottom: 110
  },


  statsRow: {
    flexDirection:
      'row',
    gap: 10,
    marginTop: 22
  },


  statCard: {
    flex: 1,
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 18,
    padding: 14,
    alignItems:
      'center'
  },


  statIcon: {
    color:
      COLORS.yellow,
    fontSize: 21
  },


  statNumber: {
    color:
      COLORS.white,
    fontSize: 23,
    fontWeight:
      '800',
    marginTop: 5
  },


  statNumberSmall: {
    color:
      COLORS.white,
    fontSize: 15,
    fontWeight:
      '800',
    marginTop: 9
  },


  statLabel: {
    color:
      COLORS.gray,
    fontSize: 11,
    marginTop: 4
  },


  historyCard: {
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 23,
    padding: 18,
    marginBottom: 12
  },


  historyTop: {
    flexDirection:
      'row',
    alignItems:
      'center'
  },


  historyServiceIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor:
      COLORS.card2,
    alignItems:
      'center',
    justifyContent:
      'center',
    marginRight: 12
  },


  historyServiceIconText: {
    color:
      COLORS.yellow,
    fontSize: 23
  },


  historyService: {
    color:
      COLORS.white,
    fontSize: 16,
    fontWeight:
      '800'
  },


  historyBarber: {
    color:
      COLORS.gray,
    fontSize: 12,
    marginTop: 4
  },


  historyPrice: {
    color:
      COLORS.yellow,
    fontSize: 17,
    fontWeight:
      '800'
  },


  historyDetails: {
    flexDirection:
      'row',
    gap: 22,
    marginTop: 16
  },


  historyDetail: {
    color:
      COLORS.gray,
    fontSize: 12
  },


  historyBottom: {
    flexDirection:
      'row',
    justifyContent:
      'space-between',
    alignItems:
      'center',
    marginTop: 16
  },


  statusText: {
    fontSize: 12,
    fontWeight:
      '700'
  },


  outlineButton: {
    borderWidth: 1,
    borderColor:
      COLORS.yellow,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 8
  },


  outlineText: {
    color:
      COLORS.yellow,
    fontSize: 11,
    fontWeight:
      '800'
  },


  emptyHistory: {
    backgroundColor:
      COLORS.card,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 22,
    padding: 35,
    alignItems:
      'center',
    marginTop: 20
  },


  emptyHistoryIcon: {
    color:
      COLORS.yellow,
    fontSize: 40
  },


  emptyHistoryTitle: {
    color:
      COLORS.white,
    fontSize: 18,
    fontWeight:
      '800',
    marginTop: 10
  },


  emptyHistoryText: {
    color:
      COLORS.gray,
    marginTop: 5
  },


  // ----------------------------
  // NAV
  // ----------------------------

  bottomNav: {
    position:
      'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 82,
    backgroundColor:
      '#181818',
    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
    flexDirection:
      'row',
    justifyContent:
      'space-around',
    alignItems:
      'center',
    paddingBottom: 5
  },


  navItem: {
    alignItems:
      'center',
    justifyContent:
      'center',
    minWidth: 60
  },


  navIcon: {
    color:
      COLORS.gray,
    fontSize: 25
  },


  navIconActive: {
    color:
      COLORS.yellow
  },


  navText: {
    color:
      COLORS.gray,
    fontSize: 10,
    marginTop: 4
  },


  navTextActive: {
    color:
      COLORS.yellow,
    fontWeight:
      '800'
  },


  // ----------------------------
  // LOADING
  // ----------------------------

  centerLoading: {
    flex: 1,
    justifyContent:
      'center',
    alignItems:
      'center'
  }

});