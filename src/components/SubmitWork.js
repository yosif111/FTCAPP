import React, { Component } from 'react';
import { View, Text, TextInput, AsyncStorage } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Card, Button } from 'react-native-elements';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';
import BaseURL from '../config';
import { Spinner } from './common';

class SubmitWork extends Component {
  state = { members: [], event: {}, inputs: [], loading: true, showAlertLoading: false };

  componentDidMount() {
    this.getInfo();
  }

  getInfo = async () => {
    //console.log('getInfo');

    this.state.event = this.props.navigation.state.params.event;
    // console.log('event', this.state.event);
    const token = await AsyncStorage.getItem('token');
    // console.log('token',token);
    const instance = axios.create({
      timeout: 1000,
      headers: { 'Authorization': 'Bearer ' + token }
    });
    instance.get(BaseURL + '/events/getUsersWithRecordedWork/' + this.state.event.id)
      .then((response) => {
         //console.log(response.data);
        //console.log(response.data[1]);

        response.data.map((item, index) => (
          this.state.members[index] = item,
          this.state.inputs[index] = ''
        ));
        

        this.setState({
          loading: false,
          showAlertLoading: false,
        });
      })
      .catch((error) => {
        //console.log(error);
        alert('فيه مشكلااا صديق');
        this.setState({
          loading: false,
          showAlertLoading: false,
        });
      });
  }

  validateDescription = (text) => {
    if (text === undefined || text === '' || text == null || text.length < 10) 
        return false;
    else
        return true;
  }

 //TODO with the current logic, after submission we call getInfo to update, that's not good.
 //return the new data from response of this request.  
  OnPress = async (index) => {
    //console.log(this.state.members[index].work);
    var descriptionsArray = [];
    this.state.members[index].work.map((item, index) => (
      descriptionsArray.push(item.description)
    ))

    let arrayLength = descriptionsArray.length;
    for (var i = 0; i < arrayLength; i++) {
      if (this.validateDescription(descriptionsArray[i]) == false) {
        alert('مب على كيفك، لازم تكتب 10 حروف على الاقل');
        return;
      }
  }
  const text = this.state.inputs[index];
    if(text !== undefined && text !== ''){ // the lastestInput is filled
      if(text.length < 10){
         alert('مب على كيفك، لازم تكتب 10 حروف على الاقل');
         return;
      }
    }


    this.setState({
      showAlertLoading: true
    });
    const token = await AsyncStorage.getItem('token');
    const instance = axios.create({
      timeout: 5000,
      headers: { 'Authorization': 'Bearer ' + token }
    });
    instance.post(BaseURL + '/points/recordWork', {
      user_id: this.state.members[index].user_id,
      event_id: this.state.event.id,
      description: this.state.inputs[index],
      selfRecordedWork: this.state.members[index].work
    }).then((response) => {
       //console.log(response);
      
      this.state.inputs = []; // erase the inputs
      this.getInfo();
    })
      .catch((error) => {
        // console.log(error.response);
      });
  }

  renderSpinner() {
    return <Spinner />;
  }

  renderSingleCard = (item, index) => {
    const { singleWorkStyle, workTextStyle, line } = styles;
    let latestIndex = item.work.length == undefined ? 0 : item.work.length;
    return (
      <View key={'CardMainView' + item.user_id} style={[{ marginBottom: index === this.state.members.length - 1 ? 20 : 0 }, styles.pageStyle]}  >
        <Card key={'Card' + item.user_id} title={item.name} containerStyle={{ borderRadius: 10 }}>
          {
            item.work.map((work, indexWork) => {

              return (
                <View key={'workView' + item.user_id + indexWork} style={singleWorkStyle} >
                  <TextInput
                    key={'textInput' + item.user_id + indexWork}
                    multiline
                    numberOfLines={2}
                    value={this.state.members[index].work[indexWork].description}
                    onChangeText={(text) => (this.state.members[index].work[indexWork].description = text, this.forceUpdate())}
                    style={{ textAlign: 'center', width: '100%' }}
                  />

                  <View key={'line' + item.user_id + indexWork} style={line} />
                </View>
              );
            })
          }
          {/* the line that he rights on */}
          <View key={'writingLine' + item.user_id} style={singleWorkStyle} >
            <TextInput
              multiline
              placeholder={'وش سوا؟'}
              autoCapitalize={'none'}
              numberOfLines={2}
              autoCorrect={false}
              onChangeText={(text) => (this.state.inputs[index] = text, this.forceUpdate())}
              value={this.state.inputs[index]}
              style={{ textAlign: 'center', width: '100%' }}
            />

            <View key={'lastLine' + item.user_id} style={line} />
          </View>
          <Button
            key={'Submitbutton' + item.user_id}
            onPress={() => this.OnPress(index)}
            title='سجلها'
            rightIcon={{ name: 'done' }}
            backgroundColor='#9ccc65'
            style={{ alignSelf: 'center' }}
            rounded
          />
        </Card>
      </View>

    );
  }
  renderCards() {
    return this.state.members.map((item, index) => (
      <View key={'mainView' + item.user_id} >
        {this.renderSingleCard(item, index)}

      </View>

    ));
  }

  render() {
    if (this.state.loading) {
      return this.renderSpinner();
    } else if (this.state.members.length == 0) { // nothing to approve
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, backgroundColor: '#ECF2F4' }}>
          <Text style={{ fontSize: 30 }}>فارغة كحياتي بدونك :)</Text>
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: '#ECF2F4' }}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps='always' extraScrollHeight={60}>
      <Card containerStyle={{ borderRadius: 10, alignItems: 'center', }} title={'تعليمات'} >
        <Text style={{ fontWeight: 'bold', fontSize: 13, textAlign: 'right' }}>
        • أكتب لكل منظم ايش سوا وبيرفع عمله إلى رئيس النادي. {'\n'}
        • تقدر ترصد أعمال العضو مرة أخرى بعد ما تسجلها.{'\n'}
        • العضو يقدر يشوف وش كتبت عنه.
        </Text>     
      </Card>
        {this.renderCards()}
      </KeyboardAwareScrollView>
      <AwesomeAlert
        show={this.state.showAlertLoading}
        showProgress
        title="لحظات"
        message="جاري تنفيذ طلبك.."
        closeOnTouchOutside
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={false}
      />
      </View>


    );
  }
}

const styles = {
  pageStyle: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#ECF2F4',
  },
  singleWorkStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'

    // paddingRight: 20,
    // paddingLeft: 20
  },
  workTextStyle: {
    fontSize: 14,
    textAlign: 'right',
    marginLeft: 40,
    marginRight: 15,
    color: '#515151'
  },
  line: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 1,
    borderColor: '#e5e5e5'
  },
};


export default SubmitWork;
