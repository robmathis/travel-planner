import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function AddTripScreen() {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Verify session; if no session, redirect to Login
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigation.dispatch(
          CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
        );
      }
    };
    checkSession();
  }, []);

  const handleSave = async () => {
    if (!destination.trim()) {
      return Alert.alert('Validation', 'Destination is required.');
    }
    setLoading(true);
    const {
      data: { user
      }
    } = await supabase.auth.getUser();
    const userId = user?.id;
    if (!userId) {
      setLoading(false);
      return Alert.alert('Error', 'User not logged in');
    }

    const { error } = await supabase.from('trips').insert({
      user_id: userId,
      destination: destination.trim(),
      start_date: startDate || null,
      end_date: endDate || null,
      notes: notes || null,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error saving trip', error.message);
    } else {
      // Navigate back to Home and refresh list
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Home' }] })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.inner}
      >
        <Text style={styles.title}>Add New Trip</Text>

        <TextInput
          placeholder="Destination"
          value={destination}
          onChangeText={setDestination}
          style={styles.input}
          autoCapitalize="words"
        />

        <TextInput
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={setStartDate}
          style={styles.input}
        />

        <TextInput
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={setEndDate}
          style={styles.input}
        />

        <TextInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          style={[styles.input, styles.notes]}
        />

        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Save Trip" onPress={handleSave} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  notes: {
    height: 80,
    textAlignVertical: 'top',
  },
});

