import React, { Component } from "react";
import ImageSource from "../assets/imgs/car-wireframe.png";
import urlApi from "../baseUrl/urlApi";
import { Actions } from "react-native-router-flux";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  Picker,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { SearchBar, Button, Input } from "react-native-elements";
//import Icon from "react-native-vector-icons/FontAwesome";

export default class NewCar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marca: "",
      dataMarca: [],
      count: 0,
      errorMsg: "",
      descricao: "",
      modelo: "",
      ano: "",
      marca: "",
      cor: "",
      valor: "",
      kilometragem: "",
      objDados: [],
      load: false
    };
  }
  //Show loader
  Loader = () => {
    if (this.state.load) {
      return (
        <View style={[styles.containerLoading, styles.horizontalLoading]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
  };
  //listar todas as marcas
  ListMarcas = async () => {
    this.setState({ load: true });
    await urlApi
      .get("marcas")
      .then(mr => {
        if (mr.data.error) {
          this.setState({
            errorMsg: "Nenhuma marca encontrada"
          });
        } else {
          this.setState({
            dataMarca: mr.data.data.rows,
            count: mr.data.data.count
          });
        }
        this.setState({ load: false });
      })
      .catch(error => {
        console.log(error);
      });
  };
  //Inserir um novo carro
  InsertCar = async () => {
    this.setState({ load: true });
    const bodyData = {
      descricao: this.state.descricao,
      placa: this.state.placa,
      modelo: this.state.modelo,
      ano: this.state.ano,
      id_marca: this.state.id_marca,
      cor: this.state.cor,
      valor: this.state.valor,
      kilometragem: this.state.kilometragem
    };
    if (this.state.descricao == "") {
      alert("Por favor preencha a descrição");
    } else if (this.state.placa == "") {
      alert("Por favor preencha a placa");
    } else if (this.state.modelo == "") {
      alert("Por favor preencha o modelo");
    } else if (this.state.cor == "") {
      alert("Por favor preencha a cor");
    } else if (this.state.valor == "") {
      alert("Por favor preencha o valor");
    } else {
      await urlApi
        .post("carros", bodyData)
        .then(() => {
          alert("Carro cadastrado");
          Actions.home();
          this.setState({ load: false });
        })
        .catch(error => {
          alert(JSON.stringify(error));
        });
    }
  };
  //Atualizar dados de um carro
  updateCar = async () => {
    this.setState({ load: true });
    const bodyData = {
      descricao: this.state.descricao,
      placa: this.state.placa,
      modelo: this.state.modelo,
      ano: this.state.ano,
      id_marca: this.state.id_marca,
      cor: this.state.cor,
      valor: this.state.valor,
      kilometragem: this.state.kilometragem
    };
    await urlApi
      .put(`carros/${this.props.obj.id}`, bodyData)
      .then(() => {
        alert("Dados atualizados");
        Actions.home();
        this.setState({ load: false });
      })
      .catch(error => {
        this.setState({ load: false });
      });
  };
  deleteCar = async () => {
    this.setState({ load: true });
    await urlApi
      .delete(`carros/${this.props.obj.id}`)
      .then(() => {
        Actions.home();
        this.setState({ load: false });
      })
      .catch(error => {
        this.setState({ load: false });
      });
  };
  componentDidMount = () => {
    //check se obj vem nulo la do home
    if (this.props.obj != null) {
      this.setState({
        descricao: this.props.obj.descricao,
        placa: this.props.obj.placa,
        modelo: this.props.obj.modelo,
        ano: this.props.obj.ano.toString(),
        id_marca: this.props.obj.id_marca,
        cor: this.props.obj.cor,
        valor: this.props.obj.valor.toString(),
        kilometragem: this.props.obj.kilometragem
      });
    }
    this.ListMarcas();
  };
  ShowAlertConfirm = () => {
    Alert.alert(
      "Delete",
      "Deseja apagar esse registro?",
      [
        {
          text: "Não",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Sim", onPress: () => this.deleteCar() }
      ],
      { cancelable: false }
    );
  };
  render() {
    return (
      
      <View>
       
        <ImageBackground
          source={ImageSource}
          style={styles.backgroundImgStyle}
          resizeMode="cover"
        >
          <Text style={{ fontSize: 30, textAlign: "center" }}>
            Dados do carro
          </Text>
          {/* Dados do carro formulario */}
          <ScrollView contentInsetAdjustmentBehavior="always"
          keyboardShouldPersistTaps='always'>
          <View>
            {/* Descricao do carro */}
            <View
              style={{
                display: "flex"
              }}
            >
              <Input
                placeholder="Descrição do carro"
                value={this.state.descricao}
                onChangeText={descricao =>
                  this.setState({ descricao: descricao })
                }
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
              />
            </View>
            {/* Placa do carro */}
            <View
              style={{
                display: "flex"
              }}
            >
              <Input
                placeholder="Placa do carro"
                value={this.state.placa}
                onChangeText={placa => this.setState({ placa: placa })}
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
              />
            </View>
            {/* Modelo do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Input
                placeholder="Modelo do carro"
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
                value={this.state.modelo}
                onChangeText={modelo => this.setState({ modelo: modelo })}
              />
            </View>
            {/* Ano do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Input
                placeholder="Ano do carro"
                keyboardType="numeric"
                value={this.state.ano}
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
                onChangeText={ano => this.setState({ ano: ano })}
              />
            </View>
            {/* Marca do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Picker
                selectedValue={this.state.id_marca}
                style={{ height: 50, width: 300, fontWeight: "bold" }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ id_marca: itemValue })
                }
              >
                {this.state.dataMarca.map((resp, i) => {
                  return (
                    <Picker.Item
                      key={i}
                      label={resp.nome_marca}
                      value={resp.id}
                    />
                  );
                })}
              </Picker>
            </View>
            {/* Cor do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <Input
                placeholder="Cor do carro"
                value={this.state.cor}
                onChangeText={cor => this.setState({ cor: cor })}
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
              />
            </View>
            {/* Valor do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-start"
              }}
            >
              <Input
                placeholder="Valor do carro"
                value={this.state.valor}
                onChangeText={valor => this.setState({ valor: valor })}
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
              />
            </View>
            {/* Kilometragem do carro */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "flex-start"
              }}
            >
              <Input
                placeholder="Kilometragem do carro"
                value={this.state.kilometragem}
                onChangeText={kilometragem =>
                  this.setState({ kilometragem: kilometragem })
                }
                inputStyle={{fontWeight:'bold'}}
                inputContainerStyle={{borderBottomColor:'black',borderBottomWidth:1.5}}
              />
            </View>
            {/* Buttons forms */}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 15,
                padding: 8
              }}
            >
              <View style={{ display: "flex", flexDirection: "row" }}>
                {this.props.obj != null ? (
                  <Button title="Remover" onPress={this.ShowAlertConfirm} />
                ) : (
                  <Text> </Text>
                )}
                <Text> </Text>
                <Button title="Cancelar" onPress={() => Actions.home()} />
              </View>
              <View>
                {this.props.obj == null ? (
                  <Button title="Cadastrar" onPress={this.InsertCar} />
                ) : (
                  <Button title="Salvar" onPress={this.updateCar} />
                )}
              </View>
            </View>
            {this.Loader()}
          </View>
          </ScrollView>

        </ImageBackground>
      </View>

    );
  }
}
//css page home
const styles = StyleSheet.create({
  backgroundImgStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f2d40"
  },
  containerLoading: {
    flex: 1,
    justifyContent: "center"
  },
  horizontalLoading: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});
