import os
import cv2
import numpy as np
import tensorflow as tf
import keras
from keras import layers, models
from sklearn.model_selection import train_test_split


DATA_PATH = "augmented_dataset"
IMG_WIDTH = 160
IMG_HEIGHT = 120
COMMANDS = ['LEFT', 'FORWARD', 'RIGHT'] 

def load_data():
    images = []
    labels = []
    
    files = [f for f in os.listdir(DATA_PATH) if f.endswith('.jpg')]
    print(f"Знайдено {len(files)} зображень. Починаю завантаження...")

    for filename in files:
        parts = filename.split('_')
        cmd = parts[-1].replace('.jpg', '')
        
        if cmd not in COMMANDS:
            continue
            
        img_path = os.path.join(DATA_PATH, filename)
        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE) # Вчимо на Ч/Б
        img = cv2.resize(img, (IMG_WIDTH, IMG_HEIGHT))
        
        images.append(img)
        labels.append(COMMANDS.index(cmd)) # Перетворюємо LEFT -> 0, FORWARD -> 1...

    return np.array(images), np.array(labels)

# 1. Завантаження даних
X, y = load_data()

# Нормалізація (пікселі 0-255 -> 0.0-1.0)
X = X.reshape(-1, IMG_HEIGHT, IMG_WIDTH, 1) / 255.0

# Розподіл на навчальну та тестову вибірки (80% вчимося, 20% перевіряємо)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# 2. Архітектура нейромережі (CNN)
model = models.Sequential([
    # Перший шар згортки - шукає базові лінії
    layers.Conv2D(24, (5, 5), strides=(2, 2), activation='relu', input_shape=(IMG_HEIGHT, IMG_WIDTH, 1)),
    layers.Conv2D(36, (5, 5), strides=(2, 2), activation='relu'),
    layers.Conv2D(48, (5, 5), strides=(2, 2), activation='relu'),
    
    layers.Flatten(), # Перетворюємо в плоский масив
    
    # Повнозв'язні шари (логіка прийняття рішень)
    layers.Dense(100, activation='relu'),
    layers.Dense(50, activation='relu'),
    layers.Dense(len(COMMANDS), activation='softmax') # Вихід: ймовірність для кожного класу
])

model.compile(optimizer='adam', 
              loss='sparse_categorical_crossentropy', 
              metrics=['accuracy'])

# 3. Навчання
print("Починаю навчання...")
model.fit(X_train, y_train, epochs=10, validation_data=(X_test, y_test), batch_size=32)

# 4. Збереження
model.save("robot_model.h5")
print("Модель збережена як robot_model.h5!")