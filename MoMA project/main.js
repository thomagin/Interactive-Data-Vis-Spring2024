// GLOBALS AND CONSTANTS
const width = 800;
const height = 400;
const margin = { top: 20, right: 20, bottom: 30, left: 50 };

// LOAD DATA CREATE SVG, STATE
d3.csv('https://media.githubusercontent.com/media/thomagin/collection/main/Artworks.csv')
  .then(data => {
    console.log(data);
    let svgChart = null;

    // SELECT NATIONALITY, FILTER, COUNT ACQUISITIONS, NEW ARRAY W/ ACQ PER YEAR, SORT ARRAY
    function updateChart(selectedNationality) {
      const filteredData = data.filter(d => {
        const ValidDate = !isNaN(new Date(d.DateAcquired).getFullYear());
        return d.Nationality === selectedNationality && ValidDate;
      });
      const acquisitionsPerYear = d3.rollup(filteredData, v => v.length, d => new Date(d.DateAcquired).getFullYear());
      const acquisitionsData = Array.from(acquisitionsPerYear, ([key, value]) => ({ year: key, acquisitions: value }));
      const sortedData = acquisitionsData.sort((a, b) => a.year - b.year);

        // XSCALE
      const xScale = d3.scaleBand()
        .domain(sortedData.map(d => d.year.toString()))
        .range([margin.left, width - margin.right])
        .padding(0.1);

        //YSCALE
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(sortedData, d => d.acquisitions)])
        .nice()
        .range([height - margin.bottom, margin.top]);

      if (!svgChart) {
        svgChart = d3.select('#chart-container')
          .append('svg')
          .attr('width', width)
          .attr('height', height);
      }

      const bars = svgChart.selectAll('.bar')
        .data(sortedData, d => d.year);

      // EXIT SELECTION?
      bars.exit()
        .remove();

      // MAKE BARS
      const newBars = bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => xScale(d.year.toString()))
        .attr('width', xScale.bandwidth())
        .attr('y', d => height - margin.bottom)
        .attr('height', 0)
        .attr('fill', '#A98F88')
        .merge(bars)
        .transition()
        .duration(1000) // ANIMATION TIME, MSEC
        .attr('y', d => yScale(d.acquisitions))
        .attr('height', d => height - margin.bottom - yScale(d.acquisitions));

      svgChart.selectAll('.bar')
        .data(sortedData, d => d.year)
        .attr('x', d => xScale(d.year.toString()))
        .attr('width', xScale.bandwidth());

        //REMOVE AXIS
      svgChart.selectAll('g.axis').remove();

         //REMOVE TITLE
         svgChart.selectAll('text.chart-title').remove();

      //NEW X AXIS, ROTATE LABELS
      svgChart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale)
          .tickFormat(d3.format('d')))
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');
      //NEW Y AXIS
      svgChart.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

      //APPEND NEW TITLE ETC
      svgChart.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', margin.top / 2 + 2)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text(`${selectedNationality} Art Acquisitions Over Time`);

      // LITTLE PARAGRAPHS 
      
      const nationalityText = document.getElementById('nationality-text');
      switch (selectedNationality) {
        case '(Cuban)':
          nationalityText.innerHTML = `
          <ul>
            <li>1940 - Fulgencio Batista elected President. He served two terms from 1940-44 and 1952-59. The second term was initiated by a military coup planned in Florida.</li>
            <li>1953 - Cuban revolution begins. By 1959 Fidel Castro is in power. Relations between the U.S. and Cuba deteriorate rapidly.</li>
            <li>1961 - An armed invasion by about 1,500 CIA-trained Cuban exiles at the Bay of Pigs was defeated by Cuban armed forces.</li>
            <li>1962 - The Cuban Missile Crisis.</li>
            <li>2008 - Fidel Castro steps down as President of Cuba; Barack Obama elected President of United States.</li>
            <li>2014 - U.S. and Cuba restore diplomatic ties.</li>
            <li>2017 - Donald Trump takes office, reinstates travel and business restrictions.</li>
            <li>2021 - Cuba redesignated as state sponsor of terrorism.</li>
          </ul>
        `;
          break;
        case '(Iranian)':
          nationalityText.innerHTML = `
          <ul>
        <li>1941-1979 – The reign of the last Shah of Iran. He maintained close ties with the U.S.</li>
        <li>1953 – Prime Minister Mohammed Mossadegh is overthrown by a U.S.-organized coup.</li>
        <li>1979 – The Islamic Revolution overthrows the Shah and replaces him with Ayatollah Ruhollah Komeini. The U.S. embassy in Tehran is seized, leading to a hostage crisis.</li>
        <li>1981-89 – The U.S. backs Saddam Hussein’s Iraq against Iran in the Iran-Iraq war.</li>
        <li>2002 – George W. Bush labels Iran as part of an “axis of evil” in his State of the Union speech.</li>
        <li>2013 – Hassan Rouhani elected President of Iran, seen as a moderate figure in the West.</li>
        <li>2015 – The Joint Comprehensive Plan of Action (JCPOA) is agreed to by a group of world powers and Iran, lifting sanctions on Iran in exchange for a drawdown and oversight of Iran’s nuclear program.</li>
        <li>2018 – Donald Trump unilaterally pulls out of the JCPOA.</li>
      </ul>
        `;
          break;
        case '(Chinese)':
          nationalityText.innerHTML = `
          <ul>
            <li>1949 – Mao Zedong proclaims the People’s Republic of China in Tiananmen Square.</li>
            <li>1950 – China-backed North Korea invades US-backed South Korea.</li>
            <li>1962 – China supplies resources and training to North Vietnam.</li>
            <li>1971 – Richard Nixon visits China.</li>
            <li>1979 – U.S. normalizes relations with China.</li>
            <li>1989 – Tiananmen Square protests lead to disruption in U.S.-China trade relationship; arms sales suspended.</li>
            <li>2017 – Donald Trump takes office as President after campaigning on a platform critical of China.</li>
            <li>2020 – The COVID-19 pandemic begins; both U.S. and China accuse the other of responsibility.</li>
            <li>2021 – Joe Biden takes office as President.</li>
            <li>2023 – A Chinese reconnaissance balloon is spotted over U.S. airspace in Montana.</li>
          </ul>
        `;
          break;
        case '(German)':
          nationalityText.innerHTML = `
      <ul>
        <li>1917 – U.S. enters World War I.</li>
        <li>1933 – Nazi Era begins in Germany.</li>
        <li>1939 – Hitler invades Poland.</li>
        <li>1941 – Japan attacks Pearl Harbor; U.S. declares war on Axis powers.</li>
        <li>1948 – U.S. airlifts supplies into Berlin.</li>
        <li>1990 – Germany reunifies after fall of Berlin Wall.</li>
        <li>2013 – U.S. caught wiretapping phone calls of Chancellor Angela Merkel.</li>
        <li>2017 – Donald Trump takes office after campaigning against NATO and trade deals with Europe.</li>
      </ul>
      `;
          break;
        case '(Japanese)':
          nationalityText.innerHTML = `
      <ul>
        <li>1941 – Japan attacks Pearl Harbor, pulling the U.S. into World War II.</li>
        <li>1945 – U.S. drops atomic bombs on Hiroshima and Nagasaki.</li>
        <li>1951 – U.S. and Japan sign military alliance.</li>
        <li>1960 – Protests in Japan flare up surrounding the renewal of the security treaty between U.S. and Japan, causing Eisenhower to cancel his visit.</li>
        <li>1963 – Vietnam War begins, Japan emerges as strong supporter of U.S. invasion.</li>
        <li>1971 – Nixon visits China, angering Japanese leaders; yen and dollar decoupled.</li>
        <li>1975 – U.S. withdraws from Vietnam.</li>
        <li>1985 – U.S. Senate votes on resolution condemning Japan’s trade policies as “unfair.”</li>
        <li>1992 – Japanese asset bubble bursts, ending era of tension surrounding Japanese trade policy.</li>
        <li>2017 – Donald Trump takes office, withdraws U.S. from Trans-Pacific Partnership.</li>
      </ul>
    `;
          break;
        case '(Russian)':
          nationalityText.innerHTML = `
      <ul>
        <li>1921 – Bolsheviks win Russian Civil War.</li>
        <li>1933 – U.S. and USSR formally establish diplomatic relations; U.S. is last major power to formally recognize Soviet government.</li>
        <li>1945 – World War II ends.</li>
        <li>1947 – NATO created, designed to establish collective security against USSR.</li>
        <li>1964 – First bilateral treaty between U.S. and USSR.</li>
        <li>1972 – Anti-Ballistic Missile Treaty signed by U.S. and USSR.</li>
        <li>1979 – U.S. and USSR agree to SALT II treaty; after USSR invades Afghanistan, U.S. Senate refuses to ratify.</li>
        <li>1989 – General Secretary Gorbachev and President Bush declare Cold War over.</li>
        <li>1999 – Czech Republic, Hungary, and Poland admitted to NATO.</li>
        <li>2011 – U.S. overthrows government in Libya, angering Russia; Russia backs Assad</li>
        <li>2013 – Edward Snowden seeks asylum in Russia.</li>
        <li>2014 – Russia invades and annexes Crimea.</li>
        <li>2015 – Russia begins air campaign in Syria. </li>
        <li>2016 – Russia accused of intervention in U.S. presidential election in favor of Donald Trump.</li>
        <li>2021 – President Biden takes office.</li>
        <li>2022 – Russia invades Ukraine.</li>
        </ul>
    `;
          break;
        case '(Ukrainian)':
          nationalityText.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet leo ut tempus scelerisque. Pellentesque at nulla et erat molestie vehicula sit amet ut elit. Ut blandit enim nulla, et scelerisque turpis semper sed. Vivamus ex nulla, varius nec blandit at, sagittis et sem. Donec a urna ut velit tempus porta. Maecenas ullamcorper diam tempus tellus scelerisque vestibulum. Proin tristique lobortis egestas. Proin porta, turpis nec ultrices luctus, eros orci imperdiet erat, vel dapibus neque felis id ligula. Sed dignissim neque sed dignissim tempus. Mauris ornare ipsum id scelerisque porttitor. Nunc volutpat ex nulla, eget sodales eros sodales sed. Pellentesque congue suscipit arcu, non ultricies nulla. Maecenas viverra placerat hendrerit. Vivamus ligula lorem, faucibus ac tempus non, tristique ultrices magna. Donec non varius ligula.";
          break;
        default:
          nationalityText.textContent = "Select a nationality from the dropdown to see related information.";
      }
    }

    // LANDING/DEFAULT CHART
    updateChart('(Cuban)');

    // EVENT LISTENER FOR DROPDOWN
    document.getElementById('nationality-select').addEventListener('change', function () {
      const selectedNationality = this.value;
      updateChart(selectedNationality);
    });
  })