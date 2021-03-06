import React, { Component } from 'react';
import {
  Text,
  View,
  ImageBackground,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Linking,
  StatusBar,
  Platform
} from 'react-native';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import normalize from 'react-native-elements/src/helpers/normalizeText';
import AwesomeAlert from 'react-native-awesome-alerts';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import BaseURL from '../config';
import { Spinner } from './common';

class Home extends Component {
  state = {
    loading: true,
    points: null,
    rank: null,
    status: '',
    qotd: '', // quote of the day
    qotdWriter: '',
    avg: null,
    firstName: '',
    lastName: '',
    userEvents: [],
    refreshing: false,
    profilephoto: '',
    clicks: 0
  }

  componentDidMount() {
    this.getInfo();
  }

  onSecretPlaceClick() {
    const { clicks } = this.state;
    if (clicks === 20) {
      this.BeMillionare();
      this.state.clicks = 0;
    } else {
      this.state.clicks++;
    }
  }

  getInfo = async () => {
    const token = 'Bearer ' + (await AsyncStorage.getItem("token"));
    const id = await AsyncStorage.getItem("userID");
    const firstName = await AsyncStorage.getItem("firstName");
    const lastName = await AsyncStorage.getItem("lastName");

    const instance = axios.create({
      timeout: 3000,
      headers: { Authorization: token }
    });
    instance
      .get(BaseURL + "/users/" + id + "/points")
      .then(response => {
        this.setState({
          points: response.data.points,
          rank: response.data.rank,
          status: response.data.status,
          avg: response.data.avgOfPoints,
          qotd: response.data.QuoteOfTheDay,
          qotdWriter: response.data.QuoteOfTheDayWriter,
          firstName,
          lastName,
          userEvents: response.data.events,
          profilephoto: BaseURL + "/users/getUserImage/" + id
        });
      })
      .catch(error => {
        //console.log(error.response);
        alert("التطبيق ما اتصل بالسيرفر، شيك على الانترنت عندك");
      });
    this.setState({ loading: false });
  };

  BeMillionare() {
    alert('مبروووووووووووووووووووووووك!!! لقد الربحت جائزة القيمة 9999 نقطة الف العميل عزيزي!');
    this.setState({ points: 9999, rank: 1, status: 'الهامووووورررر' });
  }

  openWhatsappGroup(link) {
    if (link == null) {
      this.setState({ showNoWhatsappAlert: true });
      return;
    }

    Linking.openURL(link).catch(err => console.error("An error occurred", err));
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getInfo();
    this.setState({ refreshing: false });
  }

  hideAlert = () => {
    this.setState({
      showNoWhatsappAlert: false
    });
  };

  goToPoints = () => {
    this.props.navigation.navigate("Points");
  };

  renderUserEvents() {
    if (this.state.userEvents.length === 0) {
      return <Text style={{ margin: 10 }}>ماسجلت بفعاليات للآن :( </Text>;
    }
    return this.state.userEvents.map((event, index) => (
      <View
        key={"MainView" + index}
        style={{ width: "100%", alignItems: "center" }}
      >
        <TouchableOpacity
          onPress={() => this.openWhatsappGroup(event.whatsapp_link)}
          key={"SubView" + index}
          style={{ flexDirection: "row", marginLeft: 20, marginRight: 20 }}
        >
          <Image
            style={styles.whatsappImageStyle}
            source={require("./images/whatsapp.png")}
          />
          <Text style={styles.eventNameStyle}>{event.name}</Text>
        </TouchableOpacity>
        <View
          key={index}
          style={
            index == this.state.userEvents.length - 1
              ? { marginBottom: 10 }
              : styles.line
          }
        />
      </View>
    ));
  }

  renderProfilePhoto = () => {
    const {
      headerColumn,
      userImage,
    } = styles;
    if (this.state.profilephoto !== '') {
      return (
        <TouchableWithoutFeedback onPress={this.onSecretPlaceClick.bind(this)}>
          <View style={headerColumn}>
            <Image
              style={userImage}
              source={{
                uri: this.state.profilephoto,
              }}
              resizeMethod={'resize'}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <View style={headerColumn}>
        <Image style={userImage} />
      </View>
    );
  };

  renderSpinner() {
    return <Spinner />;
  }

  renderItem({ item, index }) {
    return (
      <View style={styles.slide}>
        <Image
          style={styles.memeImage}
          source={{
            uri: item.pic,
          }}
          resizeMethod={'resize'}
          resizeMode={'stretch'}
        />
      </View>
    );
  }

  renderCarousel = () => {
    const {
      shadowStyle,
      qotdCardStyle,
      sectionStyle
    } = styles;
    return (
      <View style={[sectionStyle, { marginTop: 10, marginBottom: 10 }]}>
      <View style={[qotdCardStyle, shadowStyle]}>
      <Carousel
                data={[
                {
                  pic: 'https://i.redd.it/nz8aqgez6vs01.jpg'
                },
                {
                  pic: 'https://i.imgur.com/2nCt3Sbl.jpg'
                },
                {
                  pic: 'https://i.imgur.com/lceHsT6l.jpg'
                },
                {
                  pic: 'https://i.imgur.com/KZsmUi2l.jpg'
                },
                {
                  pic: 'https://i.imgur.com/2nCt3Sbl.jpg'
                },
                {
                  pic: 'https://i.imgur.com/lceHsT6l.jpg'
                }
              ]}
              renderItem={this.renderItem}
              sliderWidth={300}
              sliderHeight={300}
              itemWidth={300}
              itemHeight={300}
              layout={'tinder'}
              layoutCardOffset={0}
      />
      </View>
      </View>
    );
  }

  renderPointsCards = () => {
    const {
      sectionStyle,
      cardContentStyle,
      cardStyle,
      shadowStyle,
      cardBackgroundStyle,
      cardTitleStyle,
    } = styles;
    return (
      <TouchableOpacity onPress={this.goToPoints}>
      <View style={[sectionStyle, { marginTop: 25 }]}>
        <View style={[cardStyle, shadowStyle, { marginRight: 5 }]}>
          <ImageBackground
            style={[cardStyle, cardBackgroundStyle]}
            source={require("./images/rank.png")}
          >
            <Text style={cardContentStyle}>{this.state.rank}</Text>
            <Text style={cardTitleStyle}>ترتيبك</Text>
          </ImageBackground>
        </View>
        <View style={[cardStyle, shadowStyle, { marginLeft: 5 }]}>
          <ImageBackground
            style={[cardStyle, cardBackgroundStyle]}
            source={require("./images/pts.png")}
          >
            <Text style={cardContentStyle}>{this.state.points}</Text>
            <Text style={cardTitleStyle}>نقاطك</Text>
          </ImageBackground>
        </View>
      </View>
    </TouchableOpacity>
    );
  }

  renderEventsCard = () => {
    const {
      shadowStyle,
      qotdCardStyle,
    } = styles;
    return (
      <View style={[qotdCardStyle, shadowStyle]}>
          <Text
            style={{
              fontSize: normalize(14),
              fontWeight: "bold",
              color: "#43484d",
              textAlign: "center",
              marginTop: 15
            }}
          >
            المشاريع الي سجلت فيها
          </Text>
          <View style={styles.line} />
          {this.renderUserEvents()}
        </View>
    );
  }
  renderQuote = () => {
    const {
      shadowStyle,
      qotdCardStyle,
      qotdContentStyle,
      qotdWriterContentStyle
    } = styles;
    return (
      <View style={[qotdCardStyle, shadowStyle]}>
      <Text
        style={{
          fontSize: normalize(14),
          fontWeight: "bold",
          color: "#43484d",
          textAlign: "center",
          marginTop: 15
        }}
      >
        كلام ما يهمك
      </Text>
      <View style={styles.line} />
      <Text style={qotdContentStyle}>{this.state.qotd}</Text>
      <Text style={qotdWriterContentStyle}>{'"-' + this.state.qotdWriter + '"'}</Text>
    </View>
    );
  }
  renderTopSection = () => {

    const {
      sectionStyle,
      nameStyle,
      statusStyle,
    } = styles;
    return (
      <View>
      <Text style={nameStyle}>
        {this.state.firstName} {this.state.lastName}
      </Text>
      <Text style={statusStyle}>{this.state.status}</Text>
      
      
      {this.renderPointsCards()}

      <View style={[sectionStyle, { marginTop: 10 }]}>
      {this.renderQuote()}
      </View>

      <View style={[sectionStyle, { marginTop: 10, marginBottom: 10 }]}>
        {this.renderEventsCard()}
      </View>
    </View>
    );
  }
  renderAwesomeAlert= () => {
    return (
    <AwesomeAlert
            show={this.state.showNoWhatsappAlert}
            showProgress={false}
            title="نعتذر منك"
            message="رئيس مشروعك زبال ما سوى قروب واتساب"
            showCancelButton={false}
            confirmText="طيب"
            onConfirmPressed={() => {
              this.hideAlert();
            }}
    />
    );
  }

  render() {
    if (this.state.loading) {
      return this.renderSpinner();
    }
    const {
      pageStyle,
      headerImage,
    } = styles;

    return (
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#1976D2" />
        <ImageBackground
          style={headerImage}
          source={require("./images/headerImage.jpg")}
        >
          <ScrollView
            style={pageStyle}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >

            {this.renderProfilePhoto()}
            
            {/* includes the points and rank card, Quote card and events card */}
            {this.renderTopSection()}              

            {this.renderCarousel()}

          </ScrollView>
          {this.renderAwesomeAlert()}


        </ImageBackground>
      </View>
    );
  }

}
const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: "column"
  },
  containerStyle: {
    marginTop: 40,
    marginBottom: 20,
    marginRight: 5,
    marginLeft: 5
  },
  headerColumn: {
    ...Platform.select({
      ios: {
        alignItems: "center",
        elevation: 1,
        marginTop: 35
      },
      android: {
        alignItems: 'center',
        marginTop: 35,
      }
    })
  },
  userImage: {
    borderColor: '#fff',
    borderRadius: 85,
    borderWidth: 3,
    height: 170,
    marginBottom: 15,
    width: 170
  },
  memeImage: {
    height: 300,
    width: 300
  },
  sectionStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 30,
    marginLeft: 30
  },
  headerImage: {
    flex: 1,
    ...Platform.select({
      ios: {
        ...ifIphoneX(
          {
            marginTop: 0
          },
          {
            marginTop: 21
          }
        )
      },
      android: {
        marginTop: 0
      }
    })
  },
  nameStyle: {
    fontSize: normalize(30),
    color: "#fff",
    alignSelf: "center",
    marginTop: 0
  },
  statusStyle: {
    alignSelf: "center",
    color: "#e5e5e5",
    fontSize: 14
  },
  cardStyle: {
    flex: 1,
    height: 100,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 10
  },
  shadowStyle: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1
  },
  cardBackgroundStyle: {
    width: "65%",
    height: "65%"
  },
  cardContentStyle: {
    fontSize: 35,
    color: "#0684B7",
    fontWeight: "bold"
  },
  cardTitleStyle: {
    fontSize: 14,
    color: "#515151"
  },
  qotdCardStyle: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    borderRadius: 10
  },
  qotdContentStyle: {
    fontSize: 15,
    color: "#515151",
    padding: 8,
    textAlign: "center",
    marginBottom: 3
  },
  qotdWriterContentStyle: {
    fontSize: 10,
    color: "#515151",
    padding: 5,
    textAlign: "center",
    marginBottom: 10
  },
  statusBarBackground: {
    width: "100%",
    height: 21,
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
    opacity: 0.3
  },
  line: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderColor: "#e5e5e5"
  },
  whatsappImageStyle: {
    width: 25,
    height: 25
  },
  eventNameStyle: {
    flex: 2,
    textAlign: "right",
    alignSelf: "center"
  }
};

export default Home;
