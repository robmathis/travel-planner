import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

type Trip = {
  id: string;
  user_id: string;
  destination: string;
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string | null;
};

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigation = useNavigation();

  const loadTrips = async () => {
    setLoading(true);
    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();
    if (sessionErr || !session) {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
      );
      return;
    }
    const userId = session.user.id;
    const { data, error: fetchErr } = await supabase
      .from<Trip>('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (fetchErr) {
      Alert.alert('Error loading trips', fetchErr.message);
    } else {
      setTrips(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout failed', error.message);
    } else {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] })
      );
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    setLoading(true);

    const {
      data: { session },
      error: sessionErr,
    } = await supabase.auth.getSession();
    if (sessionErr || !session) {
      Alert.alert('Not logged in');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId)
      .eq('user_id', session.user.id);

    if (error) {
      Alert.alert('Delete failed', error.message);
    }

    await loadTrips();
  };

  const renderTrip = ({ item }: { item: Trip }) => (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 16 }}>{item.destination}</Text>
      <Button
        title="Delete"
        color="red"
        onPress={() =>
          Alert.alert('Delete Trip', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => handleDeleteTrip(item.id),
            },
          ])
        }
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" />
        <Text>Loading trips…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 20 }}>
        Your Trips
      </Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTrip}
        ListEmptyComponent={<Text>No trips found. Add one!</Text>}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Button title="Add Trip" onPress={() => navigation.navigate('AddTrip')} />
        <View style={{ height: 10 }} />
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </SafeAreaView>
  );
}














