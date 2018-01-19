import React, { Component } from 'react';
import { View } from 'react-native';
import { List, ListItem } from 'react-native-elements';


export default class More extends Component {
  state = { options: [] };


    componentDidMount() {
      this.setState({
        options: [
          {
            title: 'رصد النقاط',
            icon: 'work'
          },
          {
            title: 'ارسال التنبيهات',
            icon: 'send',
          },
          {
            title: 'الأعضاء',
            icon: 'work'
          },
          {
            title: 'حسابي',
            icon: 'account-circle',
          },
         ]
    });
  }
  onPress = (x) => {
    if (x == 0)
      this.props.navigation.navigate('ApprovePoints');
    else if (x == 1)
      this.props.navigation.navigate('SendNotifications');
    else if (x == 2)                      
      this.props.navigation.navigate('UsersList');
    else if(x == 3)
     this.props.navigation.navigate('MyProfile');

  }
  render() {
    const { pageStyle, listStyle, listItem } = styles;
    return (
      <View style={pageStyle}>
        <List style={listStyle}
        containerStyle={{ marginBottom: 20, marginTop: 0 }}
        >
          {
            this.state.options.map((item, i) => (
              <ListItem
                onPress={() => this.onPress(i)}
                style={listItem}
                key={i}
                title={item.title}
                leftIcon={{ name: item.icon }}
              />
            ))
          }
        </List>
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
  listStyle: {
    justifyContent: 'space-between',
    height: 100,
  },
  listItem: {

  }

};
