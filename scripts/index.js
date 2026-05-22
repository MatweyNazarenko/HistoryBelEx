


    (function() {
        // ---------- СПРАВОЧНИК БИЛЕТОВ (номера, название, путь к файлу) ----------
        // Учитываем реальные имена файлов: "билет 1.html", "билет 2.html", "билет 3.html",
        // "билет4.html", "билет 5.html", "билет 6.html", "билет 7.html",
        // "билет8.html", "билет9.html", "билет10.html", "билет11.html", "билет12.html"

        function deleteBackBtn(){
            try{
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if(iframeDoc){
                    const backBtn = iframeDoc.getElementById('backBtn');
                    if(backBtn){
                        backBtn.remove();
                    }
                }
            }catch(e){
                console.log('Есть проблема: ' + e);
            }
        }

        const tickets = [
            { num: 1, title: "Древние люди на территории Беларуси", file: "pages/bil1.html" },
            { num: 2, title: "Полоцкое и Туровское княжества X–XII вв.", file: "pages/bil2.html" },
            { num: 3, title: "Христианизация белорусских земель X–XIII вв.", file: "pages/bil3.html" },
            { num: 4, title: "Образование Великого Княжества Литовского", file: "pages/bil4.html" },
            { num: 5, title: "Борьба с агрессией крестоносцев в XIII–XV вв.", file: "pages/bil5.html" },
            { num: 6, title: "Франциск Скорина – первопечатник и гуманист", file: "pages/bil6.html" },
            { num: 7, title: "Беларусь в Отечественной войне 1812 г.", file: "pages/bil7.html" },
            { num: 8, title: "Люблинская уния и Статут ВКЛ 1588 г.", file: "pages/bil8.html" },
            { num: 9, title: "Формирование белорусской народности (XIV–XVIII вв.)", file: "pages/bil9.html" },
            { num: 10, title: "Аграрная реформа 1861 г. и Столыпинская реформа", file: "pages/bil10.html" },
            { num: 11, title: "Революции 1905–1907 и Февраль 1917 в Беларуси", file: "pages/bil11.html" },
            { num: 12, title: "Беларусь в годы Первой мировой войны", file: "pages/bil12.html" },
            { num: 13, title: "Беларусь в Октябрьской революции 1917 г.", file: "pages/bil13.html" },
            { num: 14, title: "Создание Социалистической Советской Республики Беларуси (ССРБ)", file: "pages/bil14.html" },
            { num: 15, title: "Беларусь в годы польско-советской войны 1919–1921", file: "pages/bil15.html" },
            { num: 16, title: "Политика белорусизации 1920–1930-х. Наука, образование, культура", file: "pages/bil16.html" },
            { num: 17, title: "Индустриализация и коллективизация в БССР", file: "pages/bil17.html" },
            { num: 18, title: "Западная Беларусь в составе Польши (1921–1939)", file: "pages/bil18.html" },
            { num: 19, title: "Подвиг белорусского народа в Великой Отечественной войне", file: "pages/bil19.html" },
            { num: 20, title: "Геноцид населения Беларуси в годы Великой Отечественной войны", file: "pages/bil20.html" },
            { num: 21, title: "БССР во второй половине 1940-х – 1980-е гг.", file: "pages/bil21.html" },
            { num: 22, title: "БССР в 1940-х – 1980-е гг.: образование, наука, культура", file: "pages/bil22.html" },
            { num: 23, title: "Становление государственного суверенитета Республики Беларусь", file: "pages/bil23.html" },
            { num: 24, title: "Внешняя политика Республики Беларусь", file: "pages/bil24.html" },
            { num: 25, title: "Социально-экономическое развитие Республики Беларусь", file: "pages/bil25.html" },
        ];

        // DOM элементы
        const ticketListEl = document.getElementById('ticketList');
        const searchInput = document.getElementById('searchTicket');
        const iframe = document.getElementById('ticketFrame');
        const currentLabel = document.getElementById('currentTicketLabel');
        const openNewTabBtn = document.getElementById('openNewTabBtn');
        const loadingPlaceholder = document.getElementById('loadingPlaceholder');

        let activeTicketNum = 1;      // текущий выбранный билет
        let currentFile = "pages/bil1.html";

        // Функция отрисовки списка с фильтром
        function renderTicketList(filterText = '') {
            const filterLower = filterText.trim().toLowerCase();
            const filtered = tickets.filter(ticket => {
                const searchable = `${ticket.num} ${ticket.title}`.toLowerCase();
                return searchable.includes(filterLower);
            });

            ticketListEl.innerHTML = '';
            if (filtered.length === 0) {
                const emptyLi = document.createElement('li');
                emptyLi.textContent = '❌ Билеты не найдены';
                emptyLi.style.padding = '1rem';
                emptyLi.style.color = '#a13d3d';
                emptyLi.style.textAlign = 'center';
                ticketListEl.appendChild(emptyLi);
                return;
            }

            filtered.forEach(ticket => {
                const li = document.createElement('li');
                const btn = document.createElement('button');
                btn.className = 'ticket-btn';
                if (ticket.num === activeTicketNum) btn.classList.add('active');

                const numSpan = document.createElement('span');
                numSpan.className = 'ticket-num';
                numSpan.textContent = `Билет ${ticket.num}`;

                const titleSpan = document.createElement('span');
                titleSpan.className = 'ticket-title';
                titleSpan.textContent = ticket.title;

                btn.appendChild(numSpan);
                btn.appendChild(titleSpan);

                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadTicket(ticket.num, ticket.file, ticket.title);
                });
                li.appendChild(btn);
                ticketListEl.appendChild(li);
            });
        }

        // загрузка билета в iframe
        function loadTicket(num, file, title) {
            // предотвращаем повторную загрузку того же
            if (activeTicketNum === num && iframe.src.includes(file)) return;

            activeTicketNum = num;
            currentFile = file;

            // обновляем активные классы в меню
            document.querySelectorAll('.ticket-btn').forEach(btn => btn.classList.remove('active'));
            const activeBtn = Array.from(document.querySelectorAll('.ticket-btn')).find(btn => 
                btn.textContent.includes(`Билет ${num}`)
            );
            if (activeBtn) activeBtn.classList.add('active');

            currentLabel.textContent = `Билет №${num}: ${title}`;

            // Показываем лоадер перед загрузкой
            loadingPlaceholder.style.display = 'flex';
            iframe.classList.remove('loaded');

            // Устанавливаем src (с обновлением таймстампа, чтобы избежать кеширования, но не обязательно)
            iframe.src = file;
        }

        // Обработчик события загрузки iframe
        iframe.addEventListener('load', () => {
            loadingPlaceholder.style.display = 'none';
            iframe.classList.add('loaded');

            deleteBackBtn();
            // дополнительно синхронизируем заголовок на случай, если внутри iframe поменяется заголовок, но это необязательно
            try {
                // пробуем получить заголовок из iframe для красоты (но из-за CORS может не работать, если файлы локальные — работает)
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc && iframeDoc.title) {
                    let newTitle = iframeDoc.title;
                    if (newTitle && !newTitle.includes('Билет')) {
                        // оставим как есть, но обычно у билетов хорошие title
                    }
                }
            } catch(e) { /* безопасно игнорируем кросс-домен */ }
        });

        // Обработчик ошибки загрузки iframe (например, файл не найден)
        iframe.addEventListener('error', () => {
            loadingPlaceholder.style.display = 'none';
            currentLabel.textContent = `⚠️ Ошибка загрузки билета №${activeTicketNum}`;
            console.error(`Не удалось загрузить ${currentFile}`);
            // показываем сообщение прямо в iframe (опционально)
            iframe.srcdoc = `<html><body style="background:#fef1e0; font-family:serif; padding:2rem; text-align:center;"><h2>❌ Файл "${currentFile}" не найден</h2><p>Убедитесь, что все HTML-файлы билетов находятся в одной папке с этим файлом.</p><p>📁 Необходимые файлы: билет 1.html, билет 2.html, билет 3.html, билет4.html, билет 5.html, билет 6.html, билет 7.html, билет8.html, билет9.html, билет10.html, билет11.html, билет12.html</p></body></html>`;
        });

        // Открыть текущий билет в новой вкладке (удобно для распечатки или отдельной работы)
        function openCurrentInNewTab() {
            const currentTicket = tickets.find(t => t.num === activeTicketNum);
            if (currentTicket) {
                window.open(currentTicket.file, '_blank');
            } else {
                alert('Билет не найден');
            }
        }

        // поиск с debounce
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderTicketList(e.target.value);
            }, 200);
        });

        // Инициализация: загружаем первый билет (1)
        function init() {
            renderTicketList('');
            // загружаем билет 1 по умолчанию
            const firstTicket = tickets[0];
            loadTicket(firstTicket.num, firstTicket.file, firstTicket.title);
        }

        // обработчик кнопки новой вкладки
        openNewTabBtn.addEventListener('click', openCurrentInNewTab);

        // Дополнительная фича: при нажатии на клавиши стрелок вверх/вниз можно переключать билеты?
        // Опционально - для удобства (но не обязательно)
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'ArrowRight') {
                e.preventDefault();
                let next = activeTicketNum + 1;
                if (next > tickets.length) next = 1;
                const target = tickets.find(t => t.num === next);
                if (target) loadTicket(target.num, target.file, target.title);
            } else if (e.ctrlKey && e.key === 'ArrowLeft') {
                e.preventDefault();
                let prev = activeTicketNum - 1;
                if (prev < 1) prev = tickets.length;
                const target = tickets.find(t => t.num === prev);
                if (target) loadTicket(target.num, target.file, target.title);
            }
        });

        // добавим подсказку в заголовок
        const viewerHeader = document.querySelector('.viewer-header');
        const hintSpan = document.createElement('span');
        hintSpan.style.fontSize = '0.7rem';
        hintSpan.style.background = '#efebdd';
        hintSpan.style.padding = '4px 10px';
        hintSpan.style.borderRadius = '40px';
        hintSpan.style.color = '#5e4a2e';
        hintSpan.innerHTML = '⌨️ Ctrl + ← / →';
        viewerHeader.appendChild(hintSpan);

        init();
    })();