import React, { Component } from 'react';
import { Text, View, ImageBackground, AsyncStorage, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import BaseURL from '../config';
import { Spinner } from './common';
import normalize from 'react-native-elements/src/helpers/normalizeText';

class Home extends Component {
  state = {
    loading: true,
    points: null,
    rank: null,
    status: '',
    qotd: '',
    avg: null,
    firstName: '',
    lastName: '',
    userEvents: [],
    refreshing: false,
  }

  componentDidMount() {
    this.getInfo();
  }

  getInfo = async () => {
    const token = 'Bearer ' + await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('userID');
    const firstName = await AsyncStorage.getItem('firstName');
    const lastName = await AsyncStorage.getItem('lastName');

    const instance = axios.create({
      timeout: 3000,
      headers: { 'Authorization': token }
    });
    instance.get(BaseURL + '/users/' + id + '/points')
      .then((response) => {
        console.log(response.data);
        this.setState({
          points: response.data.points,
          rank: response.data.rank,
          status: response.data.status,
          avg: response.data.avgOfPoints,
          qotd: response.data.QuoteOfTheDay,
          firstName,
          lastName,
          userEvents: response.data.events
        });
      })
      .catch((error) => {
        console.log(error);
        alert('التطبيق ما اتصل بالسيرفر، شيك على الانترنت عندك');
      });
    this.setState({ loading: false });
  }

  renderSpinner() {
    return <Spinner />;
  }

  renderUserEvents() {
    return this.state.userEvents.map((event) =>
      <View style={{ width: '100%', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', marginLeft: 20, marginRight: 20 }}>
          <Text style={{ flex: 1 }}>....</Text>
          <Text style={{ flex: 2, textAlign: 'right' }} >{event.name}</Text>
        </View>
        <View style={styles.line} />
      </View>

    );
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getInfo();
    this.setState({ refreshing: false });
  }

  render() {
    if (this.state.loading) {
      return this.renderSpinner();
    }

    const { pageStyle, sectionStyle, headerImage, nameStyle, cardContentStyle,
      statusStyle, cardStyle, shadowStyle, cardBackgroundStyle,
      cardTitleStyle, qotdCardStyle, qotdContentStyle,
          } = styles;
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground style={headerImage} source={require('./images/headerImage.jpg')}>
          <ScrollView
            style={pageStyle}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <View>
              <Text style={nameStyle}>{this.state.firstName} {this.state.lastName}</Text>
              <Text style={statusStyle}>{this.state.status}</Text>
              <View style={[sectionStyle, { marginTop: 40 }]}>
                <View style={[cardStyle, shadowStyle, { marginRight: 5 }]}>
                  <ImageBackground style={[cardStyle, cardBackgroundStyle]} source={require('./images/rank.png')}>
                    <Text style={cardContentStyle}>{this.state.rank}</Text>
                    <Text style={cardTitleStyle}>ترتيبك</Text>
                  </ImageBackground>
                </View>

                <View style={[cardStyle, shadowStyle, { marginLeft: 5 }]}>
                  <ImageBackground style={[cardStyle, cardBackgroundStyle]} source={require('./images/pts.png')}>
                    <Text style={cardContentStyle}>{this.state.points}</Text>
                    <Text style={cardTitleStyle}>نقاطك</Text>
                  </ImageBackground>
                </View>
              </View>

              <View style={[sectionStyle, { marginTop: 10 }]}>
                <View style={[qotdCardStyle, shadowStyle]}>
                  <Text style={{ fontSize: normalize(14), fontWeight: 'bold', color: '#43484d', textAlign: 'center', marginTop: 15 }}>كلام ما يهمك</Text>
                  <View style={styles.line} />
                  <Text style={qotdContentStyle}>{this.state.qotd}</Text>
                </View>
              </View>

              <View style={[sectionStyle, { marginTop: 10, marginBottom: 10 }]}>
                <View style={[qotdCardStyle, shadowStyle]}>
                  <Text style={{ fontSize: normalize(14), fontWeight: 'bold', color: '#43484d', textAlign: 'center', marginTop: 15 }}>المشاريع الي حضرتك سجلت فيها</Text>
                  <View style={styles.line} />
                  {this.renderUserEvents()}
                </View>
              </View>
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
    );
  }
}
const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  containerStyle: {
    marginTop: 40,
    marginBottom: 20,
    marginRight: 5,
    marginLeft: 5
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 30,
    marginLeft: 30
  },
  headerImage: {
    flex: 1,
  },
  nameStyle: {
    fontSize: normalize(30),
    color: '#fff',
    alignSelf: 'center',
    marginTop: 40
  },
  statusStyle: {
    alignSelf: 'center',
    color: '#e5e5e5',
    fontSize: 14
  },
  cardStyle: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  shadowStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardBackgroundStyle: {
    width: '65%',
    height: '65%',
  },
  cardContentStyle: {
    fontSize: 35,
    color: '#0684B7',
    fontWeight: 'bold'
  },
  cardTitleStyle: {
    fontSize: 14,
    color: '#515151'
  },
  qotdCardStyle: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  qotdContentStyle: {
    fontSize: 15,
    color: '#515151',
    padding: 5,
    textAlign: 'center'
  },
  statusBarBackground: {
    width: '100%',
    height: 21,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#fff',
    opacity: 0.3
  },
  line: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
  },
};

export default Home;
