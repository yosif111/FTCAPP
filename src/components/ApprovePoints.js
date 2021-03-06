import React, { Component } from 'react';
import { Text, View, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { Card, Button } from 'react-native-elements';
import axios from 'axios';
import { Spinner } from './common';
import BaseURL from '../config';

class ApprovePoints extends Component {


  state = { events: [], loading: true, refreshing: false, };

  componentDidMount() {
    this.getEvents();
  }

  getEvents = async () => {
    const token = await AsyncStorage.getItem('token');
    const instance = axios.create({
      timeout: 5000,
      headers: { 'Authorization': 'Bearer ' + token }
    });
    instance.get(BaseURL + '/events/PendingWorkEvents')
      .then((response) => {
        this.setState({ events: response.data, loading: false });
      })
      .catch((error) => {
        //  console.log(error);
      });
  }

  onPress = (id) => {
    this.props.navigation.navigate('ApprovePointsSingle', {
      event_id: id
    });
  }

  goToAddPointsForNoReason = () => {
    this.props.navigation.navigate('AddPoints');
  }

  refresh = () => {
    this.setState({ loading: true });
    this.getEvents();
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    this.getEvents();
    this.setState({ refreshing: false });
  }

  render() {
    if (this.state.loading)
      return (<Spinner />);
    if (this.state.events.length > 0) {
      return (
        <ScrollView style={{ backgroundColor: '#ECF2F4' }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }>
              <Card containerStyle={{ borderRadius: 10 }} >
                <Button
                  backgroundColor='#9ccc65'
                  buttonStyle={{ borderRadius: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                  title='رصد النقاط بدون سبب'
                  rightIcon={{ name: 'checkbox-multiple-marked-outline', type: 'material-community' }}
                  onPress={() => this.goToAddPointsForNoReason()}
                />

              </Card>
        {
          this.state.events.map((item, i) => (

              <View
                style={styles.pageStyle}
                key={i}
              >
                <Card title={item.name} key={i} containerStyle={{ borderRadius: 10 }}>

                  <Text style={{ marginBottom: 25, textAlign: 'center' }}>
                    {item.description}
                  </Text>
                  <Text style={{ marginBottom: 10, textAlign: 'center' }}>
                    قائد المشروع: {item.first_name + ' ' + item.last_name}
                  </Text>
                  <Button
                    backgroundColor='#03A9F4'
                    buttonStyle={{ borderRadius: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
                    title='ارصدني'
                    rightIcon={{ name: 'checkbox-multiple-marked-outline', type: 'material-community' }}
                    onPress={() => this.onPress(item.id)}
                  />

                </Card>
              </View>
            ))
            }
        <View
          style={[{ paddingBottom: 20 }, styles.pageStyle]}
          key={'FinalCard'}
          >
        </View>
      </ScrollView >
    );
    } // esle nothing to approve
    return (
      <ScrollView style={{ backgroundColor: '#ECF2F4' }}>
        <Card containerStyle={{ borderRadius: 10 }} >
          <Button
            backgroundColor='#9ccc65'
            buttonStyle={{ borderRadius: 20, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='رصد النقاط بدون سبب'
            rightIcon={{ name: 'checkbox-multiple-marked-outline', type: 'material-community' }}
            onPress={() => this.goToAddPointsForNoReason()}
          />

        </Card>
      </ScrollView>
    );

  }

}

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ECF2F4',
  },
};

export default ApprovePoints;
