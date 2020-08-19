import React from "react";
import {useEffect,useState} from 'react'

import api from './services/api'
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {


  const [ projects , setProjects ] = useState([])

    useEffect(()=>{
        api.get('repositories').then((response)=>{
           
            setProjects(response.data)
        })

    },[])
 
    
    async function handleAddProject(){
        const response = await api.post('projects',{
            title:`projeto ${Date.now()}`,
            owner:'wennedes'
        })

        setProjects([...projects,response.data])
    }

  async function handleLikeRepository(id) {
    
      let item = await api.post(`repositories/${id}/like`)
     

      const repository = {
        id:item.data.id,
        title:item.data.title,
        url:item.data.url,
        techs:item.data.techs,
        likes:item.data.likes
      }
      
      let oldProject = projects.filter(repo=>repo.id == id)

      projects[projects.indexOf(oldProject[0])] = item.data
      console.log(projects[projects.indexOf(oldProject[0])])
      
      
     
      
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>       
        <FlatList 
                    
        data={projects}
        keyExtractor={project=> project.id}
        renderItem={({item})=>(
            <View style={styles.repositoryContainer}>
            <Text style={styles.repository}>{item.title}</Text>

            <View style={styles.techsContainer}>
              <Text style={styles.tech}>
                {item.techs}
              </Text>
            </View>

            <View style={styles.likesContainer}>
              <Text
                style={styles.likeText}
                // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                testID={`repository-likes-${item.id}`}
              >
                {item.likes} curtida
              </Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleLikeRepository(item.id)}
              // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
              testID={`like-button-${item.id}`}
            >
              <Text style={styles.buttonText}>Curtir {item.id} </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
