import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Habilitar animaciones en Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTERS = {
  ALL: 'Todas',
  ACTIVE: 'Activas',
  COMPLETED: 'Completadas',
};

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState(FILTERS.ALL);

  // Cargar tareas de AsyncStorage al iniciar
  useEffect(() => {
    AsyncStorage.getItem('tasks').then(data => {
      if (data) setTasks(JSON.parse(data));
    });
  }, []);

  // Guardar tareas automáticamente
  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newTask = { id: Date.now().toString(), title: trimmed, completed: false };
    setTasks([newTask, ...tasks]);
    setInput('');
  };

  const toggleComplete = id => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = id => {
    Alert.alert(
      'Eliminar tarea',
      '¿Estás seguro que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setTasks(tasks.filter(t => t.id !== id));
          },
        },
      ],
    );
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === FILTERS.ACTIVE) return !task.completed;
    if (filter === FILTERS.COMPLETED) return task.completed;
    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do App</Text>

      {/* Input */}
      <TextInput
        placeholder="Nueva tarea"
        value={input}
        onChangeText={setInput}
        onSubmitEditing={addTask}
        style={styles.input}
      />

      {/* Contador */}
      <View style={styles.counter}>
        <Text>Total: {tasks.length}</Text>
        <Text>Completadas: {tasks.filter(t => t.completed).length}</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filters}>
        {Object.values(FILTERS).map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleComplete(item.id)}
            onLongPress={() => deleteTask(item.id)}
            style={[
              styles.taskItem,
              item.completed && styles.taskCompleted,
            ]}
          >
            <Text style={item.completed ? styles.textCompleted : null}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  counter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  filters: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  filterText: { fontSize: 16 },
  filterActive: { fontWeight: 'bold', textDecorationLine: 'underline' },
  taskItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  taskCompleted: { backgroundColor: '#d3ffd3' },
  textCompleted: { textDecorationLine: 'line-through', color: '#555' },
});
