'use server'

import { getGameData, saveGameData } from '@/lib/data';
import { Character } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateCharacter(prevState: any, formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const sex = formData.get('sex') as string;
    const jp_family = formData.get('jp_family') as string;
    const jp_given = formData.get('jp_given') as string;
    const points = Number(formData.get('points'));
    const status = formData.get('status') as string;
    const note = formData.get('note') as string;

    if (!id || !name) {
        return { message: 'ID and Name are required' };
    }

    const data = await getGameData();
    const index = data.roster.findIndex(c => c.id === id);

    if (index === -1) {
        return { message: 'Character not found' };
    }

    const updatedCharacter: Character = {
        ...data.roster[index],
        name,
        sex,
        jp_family,
        jp_given,
        points,
        status,
        note
    };

    data.roster[index] = updatedCharacter;
    const success = await saveGameData(data);

    if (!success) {
        return { message: 'Failed to save data' };
    }

    revalidatePath('/roster');
    redirect('/roster');
}

export async function createCharacter(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const race = formData.get('race') as string;
    const raceCost = Number(formData.get('raceCost'));
    const skillsJson = formData.get('skills') as string; // JSON array of selected skills
    const points = Number(formData.get('points')); // Remaining points

    if (!name) {
        return { message: 'Name is required' };
    }

    const selectedSkills = JSON.parse(skillsJson || '[]');

    // Note construction
    const skillNames = selectedSkills.map((s: any) => s.name).join(', ');
    const note = `Race: ${race} (${raceCost}). Skills: ${skillNames}`;

    const data = await getGameData();

    // Simple ID generation: find max numeric ID + 1
    let maxId = 0;
    data.roster.forEach(c => {
        const num = parseInt(c.id);
        if (!isNaN(num) && num > maxId) maxId = num;
    });
    const newId = (maxId + 1).toString();

    const newCharacter: Character = {
        id: newId,
        sex: 'Unknown', // Not in builder form yet? Defaulting.
        jp_family: '',
        jp_given: '',
        name: name,
        points: points,
        status: 'Alive',
        note: note
    };

    data.roster.push(newCharacter);
    const success = await saveGameData(data);

    if (!success) {
        return { message: 'Failed to save data' };
    }

    revalidatePath('/roster');
    redirect('/roster');
}
