import React, { Component } from "react";
import ImageSource from "../assets/imgs/car-wireframe.png";
import { Actions } from "react-native-router-flux";
import urlApi from "../baseUrl/urlApi";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ImageBackground,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableHighlight
} from "react-native";
import { SearchBar, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      count: 0,
      query: "",
      filteredData: [],
      errorMsg: "",
      load: false
    };
    this.arrayholder = [];
  }
 

  //pesquisa caixa
  SearchFilterFunction = text => {
    const query = text;
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.descricao.toLocaleLowerCase()}   
      ${item.descricao.toLocaleLowerCase()} ${item.descricao.toLocaleLowerCase()}`;

      const textData = text.toLocaleLowerCase();

      return itemData.indexOf(textData) > -1;
    });

    this.setState({ data: newData,query });
  };
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
  //listagem de carros
  ListCars = async () => {
    this.setState({ load: true });
    await urlApi
      .get("carros")
      .then(resp => {
        if (resp.data.error == false) {
            const { query } = this.state;
          const filteredData = this.arrayholder.filter(element => {
            return element.descricao
              .toLowerCase()
              .includes(query.toLocaleLowerCase());
          }); 
          this.setState({
            filteredData,
            data: resp.data.data.rows,
            count: resp.data.data.count,
            errorMsg: ""
          });
          this.arrayholder = resp.data.data.rows;
          this.setState({ load: false });
        } else {
          this.setState({ errorMsg: "Nenhum carro encontrado" });
          this.setState({ load: false });
        }
      })
      .catch(error => {
        this.setState({ load: false });
      });
  };

  componentDidMount = () => {
    this.ListCars();
  };

  render() {
    return (
      <ImageBackground
        source={ImageSource}
        style={styles.backgroundImgStyle}
        resizeMode="cover"
      >
        <View>
          <View style={styles.backgroundSearchBar}>
            <SearchBar
              value={this.state.query}
              round
              placeholder="Pesquise por um veículo"
              containerStyle={{ backgroundColor: "#1a2433" }}
              inputStyle={styles.InputSearch}
              onChangeText={(text)=>this.SearchFilterFunction(text)}
            />
          </View>

          <View>
          <ScrollView contentInsetAdjustmentBehavior="always"
           keyboardShouldPersistTaps='always'>
              {this.state.count > 0 ? (
                this.state.data.map((prod, i) => {
                  return (
                    <TouchableHighlight
                      key={i}
                      onPress={() => Actions.newCar({ obj: prod })}
                    >
                      <View style={styles.listView}>
                        <View style={styles.listBlocoA}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18
                            }}
                          >
                            {prod.descricao}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18
                            }}
                          >
                            {prod.kilometragem}
                          </Text>
                        </View>
                        <View style={styles.listBlocoB}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18
                            }}
                          >
                            {" "}
                            {"R$ " + prod.valor.toFixed(2)}
                          </Text>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 18
                            }}
                          >
                            {" "}
                            {prod.ano}
                          </Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  );
                })
              ) : (
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "red",
                      borderBottomColor: "transparent"
                    }}
                  >
                    {this.state.errorMsg}
                  </Text>
                </View>
              )}

              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignContent: "flex-end",
                  marginTop: 10
                }}
              >
                <Button
                  icon={<Icon name="plus" size={15} color="white" />}
                  buttonStyle={styles.buttonCirce}
                  onPress={() => Actions.newCar()}
                />
              </View>
            </ScrollView>
          </View>
          {this.Loader()}
        </View>
      </ImageBackground>
    );
  }
}
//css page home
const styles = StyleSheet.create({
  backgroundSearchBar: {
    display: "flex",
    backgroundColor: "#1a2433",
    padding: 0,
    margin: 0,
    width: "100%",
    height: "auto"
  },
  backgroundBody: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f2d40"
  },
  InputSearch: {
    backgroundColor: "transparent",
    color: "white",
    fontWeight: "bold"
  },
  listView: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    padding: 10,
    marginTop: 10
  },
  listBlocoA: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
  listBlocoB: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  backgroundImgStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1f2d40"
  },
  buttonCirce: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: "green",
    //fontSize:15,
    bottom: 0,
    right: 0,
    alignSelf: "flex-end",
    borderWidth: 0,
    borderStyle: "dashed",

    overflow: "scroll"
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
