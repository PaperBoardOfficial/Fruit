import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import labelService from '../services/labelService';
import { Label } from '../entities/Label';

interface LabelSelectionModalProps {
    visible: boolean;
    onClose: () => void;
    onSelectLabel: (label: Label | null) => void;
    selectedLabelId?: number | null;
}

export default function LabelSelectionModal({
    visible,
    onClose,
    onSelectLabel,
    selectedLabelId
}: LabelSelectionModalProps) {
    const [labels, setLabels] = useState<Label[]>([]);
    const [newLabelName, setNewLabelName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            loadLabels();
        }
    }, [visible]);

    const loadLabels = async () => {
        try {
            setIsLoading(true);
            const allLabels = await labelService.getAllLabels();
            setLabels(allLabels);
        } catch (error) {
            console.error('Error loading labels:', error);
            Alert.alert('Error', 'Failed to load labels');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddLabel = async () => {
        if (!newLabelName.trim()) {
            return;
        }

        try {
            setIsLoading(true);
            await labelService.createLabel(newLabelName.trim());
            setNewLabelName('');
            await loadLabels();
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Error', 'Failed to create label');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteLabel = async (id: number) => {
        Alert.alert(
            'Delete Label',
            'Are you sure you want to delete this label?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setIsLoading(true);
                            await labelService.deleteLabel(id);

                            // If the deleted label was selected, clear the selection
                            if (selectedLabelId === id) {
                                onSelectLabel(null);
                            }

                            await loadLabels();
                        } catch (error) {
                            console.error('Error deleting label:', error);
                            Alert.alert('Error', 'Failed to delete label');
                        } finally {
                            setIsLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }: { item: Label }) => (
        <TouchableOpacity
            className={`flex-row justify-between items-center p-4 border-b border-gray-200 ${selectedLabelId === item.id ? 'bg-blue-50' : ''}`}
            onPress={() => onSelectLabel(item)}
        >
            <Text className="text-base">{item.name}</Text>
            <TouchableOpacity
                className="p-1"
                onPress={() => handleDeleteLabel(item.id)}
            >
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className="w-4/5 max-h-[70%] bg-white rounded-lg p-5">
                    <View className="flex-row justify-between items-center mb-5">
                        <Text className="text-lg font-bold">Select Label</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row mb-5">
                        <TextInput
                            className="flex-1 border border-gray-300 rounded p-2 mr-2"
                            placeholder="New label name"
                            value={newLabelName}
                            onChangeText={setNewLabelName}
                        />
                        <TouchableOpacity
                            className={`bg-green-500 rounded p-2 justify-center items-center ${(!newLabelName.trim() || isLoading) ? 'opacity-50' : ''}`}
                            onPress={handleAddLabel}
                            disabled={isLoading || !newLabelName.trim()}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className={`flex-row justify-between items-center p-4 border-b border-gray-200 ${selectedLabelId === null ? 'bg-blue-50' : ''}`}
                        onPress={() => onSelectLabel(null)}
                    >
                        <Text className="text-base">No Label</Text>
                    </TouchableOpacity>

                    <FlatList
                        data={labels}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                        className="max-h-[300px]"
                    />
                </View>
            </View>
        </Modal>
    );
} 