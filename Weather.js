import React,{ useState } from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet, StatusBar, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import styled, { ThemeProvider } from 'styled-components/native';
import { theme } from './theme';
import Input from './components/Input';

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: ${({ theme }) => theme.background};
    align-items: center;
    justify-content: flex-start;
    `;

    const Title = styled.Text`
    font-size: 40px;
    font-weight: 600;
    color: ${({ theme }) => theme.main};
    align-self: flex-start;
    margin: 20px;
    `;

const List = styled.ScrollView`
    flex: 1;
    width: ${({ width }) => width - 40}px;
`;

const weatherOptions = {
    Thunderstorm: {
      iconName: "weather-lightning",
      gradient: ["#373B44", "#4286f4"],
      title: "Thunderstorm in the house",
      subtitle: "Actually, outside of the house"
    },
    Drizzle: {
      iconName: "weather-hail",
      gradient: ["#89F7FE", "#66A6FF"],
      title: "Drizzle",
      subtitle: "Is like rain, but gay 🏳️‍🌈"
    },
    Rain: {
      iconName: "weather-rainy",
      gradient: ["#00C6FB", "#005BEA"],
      title: "Raining like a MF",
      subtitle: "For more info look outside"
    },
    Snow: {
      iconName: "weather-snowy",
      gradient: ["#7DE2FC", "#B9B6E5"],
      title: "Cold as balls",
      subtitle: "Do you want to build a snowman? Fuck no."
    },
    Atmosphere: {
      iconName: "weather-hail",
      gradient: ["#89F7FE", "#66A6FF"]
    },
    Clear: {
      iconName: "weather-sunny",
      gradient: ["#FF7300", "#FEF253"],
      title: "Sunny as fuck",
      subtitle: "Go get your ass burnt"
    },
    Clouds: {
      iconName: "weather-cloudy",
      gradient: ["#D7D2CC", "#304352"],
      title: "Clouds",
      subtitle: "I know, fucking boring"
    },
    Mist: {
      iconName: "weather-hail",
      gradient: ["#4DA0B0", "#D39D38"],
      title: "Mist!",
      subtitle: "It's like you have no glasses on."
    },
    Dust: {
      iconName: "weather-hail",
      gradient: ["#4DA0B0", "#D39D38"],
      title: "Dusty",
      subtitle: "Thanks a lot China 🖕🏻"
    },
    Haze: {
      iconName: "weather-hail",
      gradient: ["#4DA0B0", "#D39D38"],
      title: "Haze",
      subtitle: "Just don't go outside."
    }
  };

export default function Weather({temp, condition}){
  const width = Dimensions.get('window').width;
  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});
  const _saveTasks = async tasks => {
      try {
          await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
          setTasks(tasks);
      } catch (e) {
          console.error(e);
      }
  };

  const _loadTasks = async () => {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      setTasks(JSON.parse(loadedTasks || '{}'));
  };

  const _addTask = () => {
      const ID = Date.now().toString();
      const newTaskObject = {
          [ID]: { id: ID, text: newTask, completed: false },
      };
      setNewTask('');
      _saveTasks({ ...tasks, ...newTaskObject });
  };
  
  const _deleteTask = id => {
      const currentTasks = Object.assign({}, tasks);
      delete currentTasks[id];
      _saveTasks(currentTasks);
  };

  const _toggleTask = id => {
      const currentTasks = Object.assign({}, tasks);
      currentTasks[id]['completed'] = !currentTasks[id]['completed'];
      _saveTasks(currentTasks);
  };

  const _updateTask = item => {
      const currentTasks = Object.assign({}, tasks);
      currentTasks[item.id] = item;
      _saveTasks(currentTasks);
  };

  const _handleTextChange = text => {
      setNewTask(text);
  };

  const _onBlur = () => {
      setNewTask('');
  };
    return (
        <LinearGradient
            colors={weatherOptions[condition].gradient}
            style={styles.container}
        >
            <StatusBar barstyle="light-content" />
            <View style={styles.Container}>
                <MaterialCommunityIcons 
                    size={96} 
                    name={weatherOptions[condition].iconName}
                    color="white"
                />
                <Text style={styles.temp}>{temp}℃</Text>
            </View>
            <View style={{...styles.Container, ...styles.textContainer}}>
                <Text style={styles.title}>{weatherOptions[condition].title}</Text>
                <Text style={styles.subtitle}>{weatherOptions[condition].subtitle}</Text>
            </View>
            <View style={styles.halfContainer}>
            <ThemeProvider theme={theme}>
          <Container>
              <StatusBar
                  barStyle="light-content"
                  backgroundColor={theme.background}
              />
              <Title>TODO List</Title>
              <Input placeholder="+ Add a Task" 
              value={newTask}
              onChangeText={_handleTextChange}
              onSubmitEditing={_addTask}
              onBlur={_onBlur}
              />
              <List width={width}>
                  {Object.values(tasks)
                  .reverse()
                  .map(item => (
                      <Task 
                          key={item.id} 
                          item={item} 
                          deleteTask={_deleteTask} 
                          toggleTask={_toggleTask}
                          updateTask={_updateTask}
                      />
                  ))}
              </List>
          </Container>
      </ThemeProvider>
            </View>
        </LinearGradient>
    );

}

Weather.propTypes = {
    temp: PropTypes.number.isRequired,
    condition: PropTypes.oneOf(["Thunderstorm", "Drizzle", "Rain", "Snow", "Atmosphere", "Clear", "Clouds", "Haze", "Mist", "Dust"]).isRequired
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    temp: {
        fontSize: 42,
        color: "white"
    },
    halfContainer: {
      flex: 1,
      backgroundColor: "#f0f",
    },
    title: {
        color: 'white',
        fontSize: 44,
        fontWeight: "300",
        marginBottom: 10
    },
    subtitle: {
        color: 'white',
        fontWeight: "600",
        fontSize: 24
    },
    textContainer: {
        paddingHorizontal: 20,
        alignItems: "flex-start"
    }
});