import json
import os

input_path = '/home/thot/proyects/supera-bert/data/ree-general.json'
output_path = '/home/thot/proyects/supera-bert/data/ree-general.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_questions = []

for i, q in enumerate(data['questions']):
    new_q = {
        "id": f"REE-GENERAL-{str(i+1).zfill(3)}",
        "question": q['question'],
        "options": [],
        "type": "simple" if q['type'] == "single" else "multiple"
    }
    
    correct_indices = q['answer']
    
    for idx, opt_text in enumerate(q['options']):
        is_correct = idx in correct_indices
        explanation = q['explanation'] if is_correct else "Esta opción no es correcta según los criterios técnicos del REE."
        
        new_q['options'].append({
            "id": idx + 1,
            "answer": opt_text,
            "isCorrect": is_correct,
            "explanation": explanation
        })
    
    new_questions.append(new_q)

new_data = [
    {
        "id": "quiz-ree-general",
        "itc": "REE-GENERAL",
        "questions": new_questions
    }
]

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(new_data, f, ensure_ascii=False, indent=2)

print(f"Transformed {len(new_questions)} questions.")
