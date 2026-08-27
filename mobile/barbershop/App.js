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


// ==========================================
// CONFIGURAÇÃO DA API
// ==========================================

// Android Emulator
const API_URL = 'http://10.0.2.2:3000';

const Stack = createNativeStackNavigator();


// ==========================================
// 1. TELA DE LOGIN
// ==========================================

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
            'Primeiro Acesso',
            data.mensagem
          );

          navigation.navigate(
            'PrimeiroAcesso',
            {
              id_usuario: data.usuario_id
            }
          );

          return;
        }


        Alert.alert(
          'Erro',
          data.mensagem ||
          'Falha ao autenticar.'
        );

        return;
      }


      // Vai para Home levando os dados
      // do usuário logado
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


    } catch (err) {


      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor.'
      );


    } finally {

      setLoading(false);

    }

  };


  return (
    <SafeAreaView style={styles.containerDark}>

      <View style={styles.loginContent}>

        <View style={styles.logoBadge}>

          <Text
            style={{
              fontSize: 32
            }}
          >
            💈
          </Text>

        </View>


        <Text style={styles.titleDark}>
          Barbershop
        </Text>


        <Text style={styles.subtitleDark}>
          Agende seu horário com facilidade
        </Text>


        <View style={styles.formContainer}>

          <Text style={styles.labelDark}>
            Email
          </Text>


          <TextInput
            style={styles.inputDark}
            placeholder="Seu email"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />


          <Text style={styles.labelDark}>
            Senha
          </Text>


          <TextInput
            style={styles.inputDark}
            placeholder="Sua senha"
            placeholderTextColor="#64748b"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />


          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleLogin}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFF"
              />

            ) : (

              <Text style={styles.btnPrimaryText}>
                ENTRAR
              </Text>

            )}

          </TouchableOpacity>


          <TouchableOpacity
            style={{
              marginTop: 15
            }}
            onPress={() =>
              navigation.navigate('Cadastro')
            }
          >

            <Text style={styles.linkText}>

              Não tem conta?{' '}

              <Text
                style={{
                  color: '#2563eb',
                  fontWeight: 'bold'
                }}
              >
                Cadastre-se
              </Text>

            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
}


// ==========================================
// 2. TELA DE CADASTRO
// ==========================================

function CadastroScreen({ navigation }) {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);


  const handleCadastrar = async () => {

    // ==========================================
    // VERIFICAR CAMPOS
    // ==========================================

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


    const nomeFormatado =
      nome.trim();

    const emailFormatado =
      email.trim().toLowerCase();

    const cepFormatado =
      cep.trim();

    const senhaFormatada =
      senha.trim();


    // ==========================================
    // VALIDAR NOME
    // ==========================================

    if (nomeFormatado.length < 6) {

      Alert.alert(
        'Atenção',
        'O nome deve ter pelo menos 6 caracteres!'
      );

      return;
    }


    const nomeValido =
      /^[A-Za-zÀ-ÿ\s]+$/;


    if (!nomeValido.test(nomeFormatado)) {

      Alert.alert(
        'Atenção',
        'O nome deve conter apenas letras!'
      );

      return;
    }


    // ==========================================
    // VALIDAR EMAIL
    // ==========================================

    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailValido.test(emailFormatado)) {

      Alert.alert(
        'Atenção',
        'Digite um email válido!'
      );

      return;
    }


    // ==========================================
    // VALIDAR CEP
    // ==========================================

    const cepValido =
      /^\d{5}-?\d{3}$/;


    if (!cepValido.test(cepFormatado)) {

      Alert.alert(
        'Atenção',
        'Digite um CEP válido!'
      );

      return;
    }


    // ==========================================
    // VALIDAR SENHA
    // ==========================================

    if (senhaFormatada.length < 6) {

      Alert.alert(
        'Atenção',
        'A senha deve ter pelo menos 6 caracteres!'
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
              nomeFormatado,

            email:
              emailFormatado,

            cep:
              cepFormatado,

            senha:
              senhaFormatada

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
          'Erro ao efetuar cadastro.'
        );

        return;
      }


      Alert.alert(
        'Sucesso!',
        data.mensagem ||
        'Usuário cadastrado com sucesso!',

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


    } catch (err) {

      Alert.alert(
        'Erro',
        'Conexão indisponível.'
      );


    } finally {

      setLoading(false);

    }

  };


  return (
    <SafeAreaView style={styles.containerLight}>

      <ScrollView
        contentContainerStyle={
          styles.scrollPadding
        }
      >

        <Text style={styles.titleLight}>
          Criar Conta
        </Text>


        <Text style={styles.subtitleLight}>
          Preencha os dados abaixo para começar
        </Text>


        <View
          style={{
            marginTop: 20
          }}
        >

          {/* NOME */}

          <Text style={styles.labelLight}>
            Nome Completo *
          </Text>


          <TextInput
            style={styles.inputLight}
            placeholder="Ex: João Silva"
            placeholderTextColor="#94a3b8"
            value={nome}

            onChangeText={(texto) => {

              const textoFiltrado =
                texto.replace(
                  /[^A-Za-zÀ-ÿ\s]/g,
                  ''
                );

              setNome(
                textoFiltrado
              );

            }}

            autoCapitalize="words"
            autoCorrect={false}
          />


          {/* EMAIL */}

          <Text style={styles.labelLight}>
            Email *
          </Text>


          <TextInput
            style={styles.inputLight}
            placeholder="exemplo@email.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />


          {/* CEP */}

          <Text style={styles.labelLight}>
            CEP *
          </Text>


          <TextInput
            style={styles.inputLight}
            placeholder="00000-000"
            placeholderTextColor="#94a3b8"
            value={cep}

            onChangeText={(texto) => {

              let cepNumeros =
                texto.replace(
                  /\D/g,
                  ''
                );


              cepNumeros =
                cepNumeros.substring(
                  0,
                  8
                );


              if (
                cepNumeros.length > 5
              ) {

                cepNumeros =
                  cepNumeros.substring(
                    0,
                    5
                  )
                  +
                  '-'
                  +
                  cepNumeros.substring(
                    5
                  );

              }


              setCep(
                cepNumeros
              );

            }}

            keyboardType="numeric"
            maxLength={9}
          />


          {/* SENHA */}

          <Text style={styles.labelLight}>
            Senha *
          </Text>


          <TextInput
            style={styles.inputLight}
            placeholder="Digite sua senha"
            placeholderTextColor="#94a3b8"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />


          {/* BOTÃO */}

          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleCadastrar}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFF"
              />

            ) : (

              <Text style={styles.btnPrimaryText}>
                CADASTRAR
              </Text>

            )}

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==========================================
// 3. TELA HOME
// ==========================================

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


  // ==========================================
  // BUSCAR AGENDAMENTOS DO USUÁRIO
  // ==========================================

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



        if (
          !Array.isArray(data)
        ) {

          setProximo(null);

          return;
        }


        // Comparar como String para evitar
        // problema número x texto
        const meusAgendamentos =
          data.filter(
            item =>

              String(
                item.id_usuario
              ) ===
              String(
                user.id_usuario
              )

          );




        // Não mostrar cancelados
        const ativos =
          meusAgendamentos.filter(
            item =>
              item.status !==
              'cancelado'
          );


        // Ordenar pela data
        ativos.sort(
          (a, b) =>
            new Date(a.data) -
            new Date(b.data)
        );


        if (
          ativos.length > 0
        ) {

          setProximo(
            ativos[0]
          );

        } else {

          setProximo(null);

        }


      } catch (error) {


        setProximo(null);


      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // ATUALIZA A HOME TODA VEZ QUE ENTRAR
  // ==========================================

  useFocusEffect(
    useCallback(() => {

      fetchAgendamentos();

    }, [user.id_usuario])
  );


  return (
    <SafeAreaView
      style={styles.containerLight}
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollPadding
        }
      >

        {/* HEADER */}

        <View
          style={styles.headerHome}
        >

          <View>

            <Text
              style={{
                color: '#64748b',
                fontSize: 14
              }}
            >
              Bem-vindo de volta,
            </Text>


            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: '#0a1a2f'
              }}
            >
              {user.nome}
            </Text>

          </View>


          <TouchableOpacity
            style={styles.avatarCircle}

            onPress={() =>
              navigation.navigate(
                'Login'
              )
            }
          >

            <Text
              style={{
                color: '#FFF',
                fontWeight: 'bold'
              }}
            >
              {user.nome
                ? user.nome
                    .charAt(0)
                    .toUpperCase()
                : 'U'}
            </Text>

          </TouchableOpacity>

        </View>


        {/* PRÓXIMO AGENDAMENTO */}

        <Text
          style={styles.sectionTitle}
        >
          Próximo Agendamento
        </Text>


        {loading ? (

          <View
            style={styles.cardEmpty}
          >

            <ActivityIndicator
              color="#2563eb"
            />

          </View>

        ) : proximoAgendamento ? (

          <View
            style={styles.cardHighlight}
          >

            <View
              style={{
                flexDirection:
                  'row',
                justifyContent:
                  'space-between',
                alignItems:
                  'center'
              }}
            >

              <Text
                style={{
                  color: '#FFF',
                  fontWeight:
                    'bold',
                  fontSize: 16,
                  flex: 1
                }}
              >

                📅{' '}

                {new Date(
                  proximoAgendamento.data
                ).toLocaleDateString(
                  'pt-BR'
                )}

                {' às '}

                {new Date(
                  proximoAgendamento.data
                ).toLocaleTimeString(
                  'pt-BR',
                  {
                    hour:
                      '2-digit',
                    minute:
                      '2-digit'
                  }
                )}

              </Text>


              <View
                style={
                  styles.badgeStatus
                }
              >

                <Text
                  style={{
                    color:
                      '#2563eb',
                    fontSize: 12,
                    fontWeight:
                      'bold'
                  }}
                >
                  {proximoAgendamento.status}
                </Text>

              </View>

            </View>


            <Text
              style={{
                color: '#dbeafe',
                marginTop: 8
              }}
            >
              Profissional:{' '}

              {
                proximoAgendamento
                  .funcionario_nome ||
                'Barbeiro'
              }

            </Text>


            {/* SERVIÇO */}

            <Text
              style={{
                color: '#dbeafe',
                marginTop: 4
              }}
            >
              Serviço:{' '}

              {
                proximoAgendamento
                  .servicos?.[0]?.nome ||
                'Corte de Cabelo'
              }

            </Text>


            {/* VALOR */}

            <Text
              style={{
                color: '#FFF',
                fontWeight:
                  '800',
                marginTop: 4,
                fontSize: 18
              }}
            >
              R${' '}

              {proximoAgendamento
                .valor_total
                ? parseFloat(
                    proximoAgendamento
                      .valor_total
                  ).toFixed(2)
                : '0.00'}

            </Text>


            {/* BOTÃO HISTÓRICO */}

            <TouchableOpacity
              style={{
                marginTop: 12,
                backgroundColor:
                  '#FFF',
                padding: 10,
                borderRadius: 8,
                alignItems:
                  'center'
              }}

              onPress={() =>
                navigation.navigate(
                  'Historico',
                  {
                    user
                  }
                )
              }
            >

              <Text
                style={{
                  color:
                    '#2563eb',
                  fontWeight:
                    'bold'
                }}
              >
                VER MEUS CORTES
              </Text>

            </TouchableOpacity>

          </View>

        ) : (

          <View
            style={styles.cardEmpty}
          >

            <Text
              style={{
                color:
                  '#64748b'
              }}
            >
              Você não tem nenhum
              agendamento pendente.
            </Text>

          </View>

        )}


        {/* AÇÕES RÁPIDAS */}

        <Text
          style={styles.sectionTitle}
        >
          Ações Rápidas
        </Text>


        <View
          style={styles.gridMenu}
        >

          <TouchableOpacity
            style={styles.menuCard}

            onPress={() =>
              navigation.navigate(
                'Agendamento',
                {
                  user
                }
              )
            }
          >

            <Text
              style={{
                fontSize: 28
              }}
            >
              ✂️
            </Text>


            <Text
              style={
                styles.menuCardText
              }
            >
              Novo Agendamento
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.menuCard}

            onPress={() =>
              navigation.navigate(
                'Fidelidade',
                {
                  user
                }
              )
            }
          >

            <Text
              style={{
                fontSize: 28
              }}
            >
              ⭐
            </Text>


            <Text
              style={
                styles.menuCardText
              }
            >
              Meu Cartão Fidelidade
            </Text>

          </TouchableOpacity>


          <TouchableOpacity
            style={styles.menuCard}

            onPress={() =>
              navigation.navigate(
                'Historico',
                {
                  user
                }
              )
            }
          >

            <Text
              style={{
                fontSize: 28
              }}
            >
              📜
            </Text>


            <Text
              style={
                styles.menuCardText
              }
            >
              Histórico de Cortes
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==========================================
// 4. TELA DE AGENDAMENTO
// ==========================================

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
  ] = useState('2026-08-20');


  const [
    hora,
    setHora
  ] = useState('14:00');


  const [
    loading,
    setLoading
  ] = useState(false);


  // ==========================================
  // CARREGAR SERVIÇOS E BARBEIROS
  // ==========================================

  useEffect(() => {

    carregarDados();

  }, []);


  const carregarDados =
    async () => {

      try {

        const [
          resS,
          resF
        ] =
          await Promise.all([

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
                s =>
                  s.status == 1
              )

            : []

        );


        setFuncionarios(

          Array.isArray(fData)

            ? fData

            : []

        );


      } catch (e) {


        Alert.alert(
          'Erro',
          'Não foi possível carregar os serviços e profissionais.'
        );

      }

    };


  // ==========================================
  // CONFIRMAR AGENDAMENTO
  // ==========================================

  const handleConfirmar =
    async () => {

      // Verificar se usuário existe
      if (!user) {

        Alert.alert(
          'Erro',
          'Usuário não encontrado. Faça login novamente.'
        );

        navigation.navigate(
          'Login'
        );

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
          'Selecione o serviço, barbeiro, data e horário!'
        );

        return;
      }


      setLoading(true);


      try {

        // ==========================================
        // MONTAR DADOS DO AGENDAMENTO
        // ==========================================

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




        // ==========================================
        // ENVIAR PARA O BACKEND
        // ==========================================

        const res =
          await fetch(
            `${API_URL}/agendamentos`,
            {

              method:
                'POST',

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



        // ==========================================
        // SUCESSO
        // ==========================================

        if (res.ok) {

          Alert.alert(

            'Sucesso!',

            'Agendamento efetuado com sucesso!',

            [

              {

                text: 'OK',

                onPress: () => {

                  // Volta para Home
                  // mantendo o usuário
                  navigation.navigate(
                    'Home',
                    {
                      user:
                        user
                    }
                  );

                }

              }

            ]

          );

        } else {

          Alert.alert(

            'Erro',

            resposta.error ||
            resposta.mensagem ||
            'Falha ao realizar agendamento.'

          );

        }


      } catch (e) {



        Alert.alert(
          'Erro',
          'Erro ao conectar ao servidor.'
        );


      } finally {

        setLoading(false);

      }

    };


  return (
    <SafeAreaView
      style={styles.containerLight}
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollPadding
        }
      >

        {/* SERVIÇOS */}

        <Text
          style={styles.sectionTitle}
        >
          1. Escolha o Serviço
        </Text>


        {servicos.map(
          item => (

            <TouchableOpacity

              key={
                item.id_servicos
              }

              style={[

                styles.itemSelectable,

                servicoSel?.id_servicos ===
                  item.id_servicos &&
                  styles.itemSelected

              ]}

              onPress={() =>
                setServicoSel(
                  item
                )
              }

            >

              <View>

                <Text
                  style={
                    styles.itemTitle
                  }
                >
                  {item.nome}
                </Text>


                <Text
                  style={{
                    color:
                      '#64748b',
                    fontSize:
                      12
                  }}
                >
                  {item.duracao} min
                  {' · '}
                  +{item.pontos} pts
                </Text>

              </View>


              <Text
                style={
                  styles.itemPrice
                }
              >
                R${' '}

                {parseFloat(
                  item.preco
                ).toFixed(2)}

              </Text>

            </TouchableOpacity>

          )
        )}


        {/* BARBEIROS */}

        <Text
          style={styles.sectionTitle}
        >
          2. Selecione o Barbeiro
        </Text>


        {funcionarios.map(
          item => (

            <TouchableOpacity

              key={
                item.id_funcionario
              }

              style={[

                styles.itemSelectable,

                barbeiroSel?.id_funcionario ===
                  item.id_funcionario &&
                  styles.itemSelected

              ]}

              onPress={() =>
                setBarbeiroSel(
                  item
                )
              }

            >

              <Text
                style={
                  styles.itemTitle
                }
              >
                {item.nome}
              </Text>


              <Text
                style={{
                  color:
                    '#2563eb',
                  fontSize:
                    12
                }}
              >
                {item.funcao}
              </Text>

            </TouchableOpacity>

          )
        )}


        {/* DATA E HORA */}

        <Text
          style={styles.sectionTitle}
        >
          3. Data e Horário
        </Text>


        <View
          style={{
            flexDirection:
              'row',
            gap: 10
          }}
        >

          <TextInput
            style={[
              styles.inputLight,
              {
                flex: 1
              }
            ]}

            value={data}

            onChangeText={
              setData
            }

            placeholder="AAAA-MM-DD"

          />


          <TextInput
            style={[
              styles.inputLight,
              {
                flex: 1
              }
            ]}

            value={hora}

            onChangeText={
              setHora
            }

            placeholder="HH:MM"

          />

        </View>


        {/* CONFIRMAR */}

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            {
              marginTop: 20
            }
          ]}

          onPress={
            handleConfirmar
          }

          disabled={
            loading
          }
        >

          {loading ? (

            <ActivityIndicator
              color="#FFF"
            />

          ) : (

            <Text
              style={
                styles.btnPrimaryText
              }
            >
              CONFIRMAR AGENDAMENTO
            </Text>

          )}

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}


// ==========================================
// 5. TELA DE FIDELIDADE
// ==========================================

function FidelidadeScreen({
  route
}) {

  const user =
    route.params?.user;


  const [
    fidelidadeData,
    setFidelidadeData
  ] = useState(null);


  useEffect(() => {

    fetchFidelidade();

  }, []);


  const fetchFidelidade =
    async () => {

      try {

        const res =
          await fetch(
            `${API_URL}/fidelidade/${user.id_usuario}`
          );


        const data =
          await res.json();


        setFidelidadeData(
          data
        );


      } catch (e) {


      }

    };


  const pontos =
    fidelidadeData?.pontos
      ? parseInt(
          fidelidadeData.pontos
        )
      : 0;


  return (
    <SafeAreaView
      style={styles.containerLight}
    >

      <ScrollView
        contentContainerStyle={
          styles.scrollPadding
        }
      >

        <View
          style={
            styles.cardPurple
          }
        >

          <Text
            style={{
              color:
                '#ede9fe',
              fontSize:
                12,
              fontWeight:
                'bold'
            }}
          >
            PROGRAMA FIDELIDADE
          </Text>


          <Text
            style={{
              color:
                '#FFF',
              fontSize:
                36,
              fontWeight:
                '800',
              marginVertical:
                8
            }}
          >

            {pontos}

            <Text
              style={{
                fontSize:
                  16
              }}
            >
              {' '}PTS
            </Text>

          </Text>


          <Text
            style={{
              color:
                '#d8b4fe',
              fontSize:
                12
            }}
          >
            Junte pontos em cada corte e troque por serviços gratuitos!
          </Text>

        </View>


        <Text
          style={styles.sectionTitle}
        >
          Seus Selos
        </Text>


        <View
          style={styles.stampsGrid}
        >

          {[
            1,2,3,4,5,
            6,7,8,9,10
          ].map(
            i => (

              <View
                key={i}

                style={[
                  styles.stampCircle,

                  (i * 10) <= pontos &&
                    styles.stampActive
                ]}
              >

                <Text
                  style={{
                    fontSize:
                      18
                  }}
                >

                  {(i * 10) <= pontos
                    ? '✂️'
                    : i}

                </Text>

              </View>

            )
          )}

        </View>


        <Text
          style={styles.sectionTitle}
        >
          Histórico de Pontos
        </Text>


        {fidelidadeData?.historico?.map(
          (h, idx) => (

            <View
              key={idx}
              style={
                styles.historyRow
              }
            >

              <Text
                style={{
                  flex: 1,
                  color:
                    '#1e293b'
                }}
              >
                {h.descricao ||
                  'Pontuação'}
              </Text>


              <Text
                style={{
                  fontWeight:
                    'bold',

                  color:
                    h.tipo ===
                    'ganho'
                      ? '#10b981'
                      : '#ef4444'
                }}
              >

                {h.tipo ===
                'ganho'
                  ? '+'
                  : '-'}

                {h.pontos} pts

              </Text>

            </View>

          )
        )}

      </ScrollView>

    </SafeAreaView>
  );
}


// ==========================================
// 6. HISTÓRICO DE CORTES
// ==========================================

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


  // ==========================================
  // BUSCAR HISTÓRICO
  // ==========================================

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



        if (
          !Array.isArray(data)
        ) {

          setHistorico([]);

          return;
        }


        // Filtrar pelo usuário
        const meusAgendamentos =
          data.filter(

            item =>

              String(
                item.id_usuario
              ) ===
              String(
                user.id_usuario
              )

          );

        // Mais recentes primeiro
        meusAgendamentos.sort(
          (a, b) =>
            new Date(b.data) -
            new Date(a.data)
        );


        setHistorico(
          meusAgendamentos
        );


      } catch (error) {


        setHistorico([]);


      } finally {

        setLoading(false);

      }

    };


  // ==========================================
  // ATUALIZA TODA VEZ QUE ABRIR A TELA
  // ==========================================

  useFocusEffect(
    useCallback(() => {

      fetchHistorico();

    }, [user?.id_usuario])
  );


  return (
    <SafeAreaView
      style={styles.containerLight}
    >

      {loading ? (

        <View
          style={{
            flex: 1,
            justifyContent:
              'center',
            alignItems:
              'center'
          }}
        >

          <ActivityIndicator
            size="large"
            color="#2563eb"
          />


          <Text
            style={{
              marginTop:
                10,
              color:
                '#64748b'
            }}
          >
            Carregando histórico...
          </Text>

        </View>

      ) : (

        <FlatList

          data={
            historico
          }


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
            styles.scrollPadding
          }


          ListHeaderComponent={

            <Text
              style={
                styles.titleLight
              }
            >
              Histórico de Cortes
            </Text>

          }


          ListEmptyComponent={

            <View
              style={{
                backgroundColor:
                  '#FFF',

                padding:
                  20,

                borderRadius:
                  10,

                marginTop:
                  20,

                alignItems:
                  'center'
              }}
            >

              <Text
                style={{
                  color:
                    '#64748b',

                  textAlign:
                    'center'
                }}
              >
                Você ainda não possui
                agendamentos.
              </Text>

            </View>

          }


          renderItem={({
            item
          }) => (

            <View
              style={
                styles.cardHistory
              }
            >

              {/* SERVIÇO E VALOR */}

              <View
                style={{
                  flexDirection:
                    'row',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center'
                }}
              >

                <Text
                  style={{
                    fontWeight:
                      'bold',

                    fontSize:
                      16,

                    flex: 1
                  }}
                >

                  {item.servicos?.[0]?.nome ||
                    item.servico_nome ||
                    'Corte de Cabelo'}

                </Text>


                <Text
                  style={{
                    color:
                      '#2563eb',

                    fontWeight:
                      'bold'
                  }}
                >

                  R${' '}

                  {item.valor_total
                    ? parseFloat(
                        item.valor_total
                      ).toFixed(2)
                    : '0.00'}

                </Text>

              </View>


              {/* DATA */}

              <Text
                style={{
                  color:
                    '#64748b',

                  marginTop:
                    8
                }}
              >

                📅{' '}

                {item.data
                  ? new Date(
                      item.data
                    ).toLocaleDateString(
                      'pt-BR'
                    )
                  : 'Data não informada'}

              </Text>


              {/* HORA */}

              <Text
                style={{
                  color:
                    '#64748b',

                  marginTop:
                    4
                }}
              >

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


              {/* BARBEIRO */}

              <Text
                style={{
                  color:
                    '#64748b',

                  marginTop:
                    4
                }}
              >

                ✂️ Profissional:{' '}

                {item.funcionario_nome ||
                  'Barbeiro'}

              </Text>


              {/* STATUS E REAGENDAR */}

              <View
                style={{
                  flexDirection:
                    'row',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',

                  marginTop:
                    10
                }}
              >

                <Text
                  style={{
                    fontSize:
                      12,

                    color:
                      item.status ===
                      'concluido'
                        ? '#10b981'
                        : item.status ===
                          'cancelado'
                        ? '#ef4444'
                        : '#f59e0b',

                    textTransform:
                      'capitalize'
                  }}
                >

                  Status:{' '}

                  {item.status ||
                    'agendado'}

                </Text>


                <TouchableOpacity
                  style={
                    styles.btnOutline
                  }

                  onPress={() =>
                    navigation.navigate(
                      'Agendamento',
                      {
                        user
                      }
                    )
                  }
                >

                  <Text
                    style={
                      styles.btnOutlineText
                    }
                  >
                    Reagendar
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

          )}

        />

      )}

    </SafeAreaView>
  );
}


// ==========================================
// NAVEGAÇÃO PRINCIPAL
// ==========================================

export default function App() {

  return (

    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
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
            title:
              'Cadastro'
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
            title:
              'Agendar Horário'
          }}
        />


        <Stack.Screen
          name="Fidelidade"
          component={
            FidelidadeScreen
          }
          options={{
            title:
              'Fidelidade'
          }}
        />


        <Stack.Screen
          name="Historico"
          component={
            HistoricoScreen
          }
          options={{
            title:
              'Meus Cortes'
          }}
        />

      </Stack.Navigator>

    </NavigationContainer>

  );
}


// ==========================================
// ESTILOS
// ==========================================

const styles = StyleSheet.create({

  containerDark: {
    flex: 1,
    backgroundColor:
      '#0a1a2f'
  },


  containerLight: {
    flex: 1,
    backgroundColor:
      '#f1f5f9'
  },


  scrollPadding: {
    padding: 20
  },


  loginContent: {
    flex: 1,
    justifyContent:
      'center',
    padding: 24,
    alignItems:
      'center'
  },


  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor:
      '#2563eb',
    justifyContent:
      'center',
    alignItems:
      'center',
    marginBottom: 12
  },


  titleDark: {
    fontSize: 28,
    fontWeight:
      'bold',
    color: '#FFF'
  },


  subtitleDark: {
    fontSize: 14,
    color:
      '#94a3b8',
    marginBottom:
      24
  },


  formContainer: {
    width: '100%'
  },


  labelDark: {
    color:
      '#cbd5e1',
    fontSize: 13,
    marginBottom: 4,
    marginTop: 12
  },


  inputDark: {
    backgroundColor:
      '#1a2a4f',

    color:
      '#FFF',

    padding: 12,

    borderRadius: 8,

    fontSize: 14,

    borderWidth: 1,

    borderColor:
      '#334155'
  },


  titleLight: {
    fontSize: 24,
    fontWeight:
      'bold',
    color:
      '#0a1a2f'
  },


  subtitleLight: {
    fontSize: 13,
    color:
      '#64748b',
    marginBottom:
      16
  },


  labelLight: {
    color:
      '#1e293b',

    fontSize: 13,

    fontWeight:
      '600',

    marginBottom: 4,

    marginTop: 10
  },


  inputLight: {
    backgroundColor:
      '#FFF',

    color:
      '#0a1a2f',

    padding: 12,

    borderRadius: 8,

    fontSize: 14,

    borderWidth: 1,

    borderColor:
      '#cbd5e1'
  },


  btnPrimary: {
    backgroundColor:
      '#2563eb',

    padding: 14,

    borderRadius: 8,

    alignItems:
      'center',

    marginTop: 20
  },


  btnPrimaryText: {
    color:
      '#FFF',

    fontWeight:
      'bold',

    fontSize: 14
  },


  linkText: {
    textAlign:
      'center',

    color:
      '#94a3b8',

    fontSize: 13
  },


  headerHome: {
    flexDirection:
      'row',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    marginBottom:
      20
  },


  avatarCircle: {
    width: 44,

    height: 44,

    borderRadius: 22,

    backgroundColor:
      '#8b5cf6',

    justifyContent:
      'center',

    alignItems:
      'center'
  },


  sectionTitle: {
    fontSize: 16,

    fontWeight:
      'bold',

    color:
      '#0a1a2f',

    marginTop:
      20,

    marginBottom:
      10
  },


  cardHighlight: {
    backgroundColor:
      '#0a1a2f',

    padding: 16,

    borderRadius: 12
  },


  cardEmpty: {
    backgroundColor:
      '#FFF',

    padding: 16,

    borderRadius: 12,

    alignItems:
      'center'
  },


  badgeStatus: {
    backgroundColor:
      '#dbeafe',

    paddingHorizontal:
      8,

    paddingVertical:
      2,

    borderRadius:
      12
  },


  gridMenu: {
    flexDirection:
      'row',

    flexWrap:
      'wrap',

    gap: 10
  },


  menuCard: {
    width: '31%',

    backgroundColor:
      '#FFF',

    padding: 14,

    borderRadius: 12,

    alignItems:
      'center',

    justifyContent:
      'center',

    elevation: 2
  },


  menuCardText: {
    fontSize: 11,

    fontWeight:
      'bold',

    color:
      '#0a1a2f',

    textAlign:
      'center',

    marginTop:
      8
  },


  itemSelectable: {
    backgroundColor:
      '#FFF',

    padding: 14,

    borderRadius: 8,

    marginBottom:
      8,

    flexDirection:
      'row',

    justifyContent:
      'space-between',

    alignItems:
      'center',

    borderWidth:
      1,

    borderColor:
      '#e2e8f0'
  },


  itemSelected: {
    borderColor:
      '#2563eb',

    backgroundColor:
      '#eff6ff'
  },


  itemTitle: {
    fontSize: 14,

    fontWeight:
      'bold',

    color:
      '#0a1a2f'
  },


  itemPrice: {
    fontSize: 14,

    fontWeight:
      'bold',

    color:
      '#2563eb'
  },


  cardPurple: {
    backgroundColor:
      '#7c3aed',

    padding: 20,

    borderRadius:
      16,

    marginTop:
      10
  },


  stampsGrid: {
    flexDirection:
      'row',

    flexWrap:
      'wrap',

    gap: 10,

    justifyContent:
      'space-between',

    marginTop:
      10
  },


  stampCircle: {
    width: '18%',

    height: 50,

    borderRadius:
      25,

    backgroundColor:
      '#e2e8f0',

    justifyContent:
      'center',

    alignItems:
      'center'
  },


  stampActive: {
    backgroundColor:
      '#8b5cf6'
  },


  historyRow: {
    backgroundColor:
      '#FFF',

    padding: 12,

    borderRadius: 8,

    flexDirection:
      'row',

    marginTop:
      8
  },


  cardHistory: {
    backgroundColor:
      '#FFF',

    padding: 14,

    borderRadius:
      10,

    marginBottom:
      10,

    borderLeftWidth:
      4,

    borderLeftColor:
      '#2563eb'
  },


  btnOutline: {
    borderWidth:
      1,

    borderColor:
      '#2563eb',

    paddingHorizontal:
      12,

    paddingVertical:
      4,

    borderRadius:
      6
  },


  btnOutlineText: {
    color:
      '#2563eb',

    fontSize:
      12,

    fontWeight:
      'bold'
  }

});