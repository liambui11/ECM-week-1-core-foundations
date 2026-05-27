// ======================= CLOSURE BUG ========================

// const container = document.getElementById("container");

// for (var i = 0; i < 5; i++) {
//   var btn = document.createElement("button");
//   btn.textContent = "Button " + i;
//   btn.addEventListener("click", function() {
//     console.log("Clicked:", i);
//   });
//   container.appendChild(btn);
// }

// for (let i = 0; i < 5; i++) {
//   var btn = document.createElement("button");
//   btn.textContent = "Button " + i;
//   btn.addEventListener("click", function() {
//     console.log("Clicked:", i);
//   });
//   container.appendChild(btn);
// }

// ===================== "THIS" CONTEXT LOST ======================

// const counter = {
//   count: 0,
//   start() {
//     setInterval(function () {
//       debugger;
//       this.count++;
//       console.log(this.count);
//     }, 1000);
//   },
// };
// counter.start();

// const counter = {
//   count: 0,
//   start() {
//     setInterval(() => {
//       this.count++;
//       console.log(this.count);
//     }, 1000);
//   }
// };
// counter.start();

// ======================== ASYNC RACE CONDITION ======================

function fetchProfile(userId) {
  const delay = Math.random() * 2000 + 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: "Nguyễn Văn A" });
    }, delay);
  });
}

function fetchPosts(userId) {
  const delay = Math.random() * 2000 + 1000;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ id: 1, title: "Bài viết số 1" }]);
    }, delay);
  });
}

function showProfile(p) {
  console.log("👉 Đã hiển thị Profile của:", p.name);
}
function showPosts(posts) {
  console.log("👉 Đã hiển thị danh sách Bài viết");
}

function testRaceCondition(userId) {
  fetchProfile(userId).then((p) => {
    debugger;
    showProfile(p);
  });

  fetchPosts(userId).then((posts) => {
    debugger;
    showPosts(posts);
  });
}

async function testPromiseAll(userId) {
  try {
    debugger;

    const [profile, posts] = await Promise.allSettled([
      fetchProfile(userId),
      fetchPosts(userId),
    ]);

    debugger;
    showProfile(profile);
    showPosts(posts);
  } catch (err) {
    console.error("Failed:", err);
  }
}

// testRaceCondition(999);
// testPromiseAll(999);

// ================================= MEMORY LEAK ================================

// class Modal {
//   open() {
//     document.addEventListener('keydown', this.handleKey);
//     this.show();
//   }

//   handleKey(e) {
//     if (e.key === 'Escape') this.close();
//   }

//   close() {
//     this.hide();
//     // Quên remove listener!
//   }
// }


// class Modal {
//   open() {
//     // Bind để giữ reference cho lần remove
//     this._handler = this.handleKey.bind(this);
//     document.addEventListener('keydown', this._handler);
//     this.show();
//   }

//   handleKey(e) {
//     if (e.key === 'Escape') this.close();
//   }

//   close() {
//     this.hide();
//     // Remove đúng reference đã add
//     document.removeEventListener('keydown', this._handler);
//     this._handler = null;
//   }
// }

// ====================== API Shape Mistake =========================

// function mockFetchUsers() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         ok: true,
//         status: 200,
//         json: async () => ({
//           results: [ 
//             { id: 1, name: "Nguyễn Văn A" },
//             { id: 2, name: "Trần Thị B" }
//           ]
//         })
//       });
//     }, 1000);
//   });
// }

// function renderUser(user) { console.log("👤 Đã render user:", user.name); }
// function showEmptyState() { console.log("📭 Không có dữ liệu để hiển thị (Empty State)!"); }

// async function loadUsers() {
//   console.log("🚀 Đang gọi API lấy danh sách user...");
  
//   const res = await mockFetchUsers();

//   if (!res.ok) throw new Error('HTTP ' + res.status);

//   const data = await res.json();

//   debugger; 

//   console.log('API response shape:', Object.keys(data));

//   const users = data.users ?? data.results ?? data.data ?? [];

//   if (users.length === 0) {
//     showEmptyState();
//     return;
//   }

//   debugger;
//   users.forEach(user => renderUser(user));
// }

// // --- KÍCH HOẠT CHẠY DEBUG ---
// loadUsers();


// ========================= INFINITY LOOP ==========================

// let tasks = [
//   { title: "Task 0", needsRetry: false },
//   { title: "Task 1", needsRetry: true  }, 
//   { title: "Task 2", needsRetry: false }
// ];

// let index = 0;
// let safetyCounter = 0; 

// while (index < tasks.length) {
//   debugger; 

//   if (tasks[index].needsRetry) {
//     tasks.push({ title: tasks[index].title + " (Retry)", needsRetry: true });
//   }

//   index++;

//   if (safetyCounter++ > 10) {
//     console.log("🛑 Safety switch activated to prevent browser freeze!");
//     break;
//   }
// }

let tasks = [
  { title: "Task 0", needsRetry: false },
  { title: "Task 1", needsRetry: true  }, 
  { title: "Task 2", needsRetry: false }
];

const fixedTasks = [...tasks]; 
let retryQueue = []; 

for (let task of fixedTasks) {
  debugger; 

  if (task.needsRetry) {
    retryQueue.push({ title: task.title + " (Retry)" });
  }
}

console.log("✅ Loop finished safely! Pending retries:", retryQueue);

