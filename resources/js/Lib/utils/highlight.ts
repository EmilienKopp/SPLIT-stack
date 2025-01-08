interface HighlightPosition {
  start: number;
  end: number;
  class: string;
}

export class FilterService {

  public static Fuzzy(target: object | Array<string>, searchQuery: string) {
    let targetString = "";
    if (!Array.isArray(target)) {
      targetString = Object.values(target).join(" ");
    } else {
      targetString = target.join(" ");
    }

    return FilterService.fuzzyMatch(targetString, searchQuery)
  }

  public static Exact(candidate: any, searchQuery: string) {
    return candidate.first_name.includes(searchQuery)
      || candidate.last_name.includes(searchQuery)
      || candidate.email.includes(searchQuery)
  }

  public static IgnoreCase(candidate: any, searchQuery: string) {
    return candidate.first_name.toLowerCase().includes(searchQuery.toLowerCase())
      || candidate.last_name.toLowerCase().includes(searchQuery.toLowerCase())
      || candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  }

  public static fuzzyHighlight(targetString: string, searchString: string, highlightClass?: string) {
    const target = this.htmlSafe(targetString)?.split('');
    const search = searchString?.split('');

    let result = target?.map((char) => {
      if (search?.map(c => c.toLowerCase()).includes(char.toLowerCase())) {
        return highlightClass
          ? `<span class="${highlightClass}">${char}</span>`
          : `<span style="font-weight-500; background-color:grey;">${char}</span>`;
      }
      return char;
    });

    return result?.join('');
  }

  public static htmlSafe(str: string) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  public static exactHighlight(targetString: string, searchString: string, highlightClass?: string) {
    const safe = FilterService.htmlSafe(targetString);

    const start = safe?.toLowerCase()?.indexOf(searchString?.toLowerCase());
    const end = start + searchString?.length;

    if (start === -1) return safe;

    let result = safe?.split('');
    result.splice(start, 0, `<span class="${highlightClass}">`);
    result.splice(end + 1, 0, "</span>");

    return result.join('');
  }

  public static exactHighlightFromArray(targetString: string, searchStrings: string[], highlightClass?: string) {
    let result = FilterService.htmlSafe(targetString);
    let resultArray = targetString.split('');
    // check that any of the search strings are in the target string, and highlight them
    searchStrings.forEach(searchString => {
      const start = result?.toLowerCase()?.indexOf(searchString?.toLowerCase());
      const end = start + searchString?.length;

      if (start === -1) return;

      resultArray.splice(start, 0, `<span class="${highlightClass}">`);
      resultArray.splice(end + 1, 0, "</span>");
      result = resultArray.join('');
    });
    return result;
  }

  public static highlight(
    targetString: string,
    searchString: string,
    highlightClass?: string,
    type: "fuzzy" | "exact" = "exact") {
    switch (type) {
      case "fuzzy":
        return FilterService.fuzzyHighlight(targetString, searchString, highlightClass);
      case "exact":
        return FilterService.exactHighlight(targetString, searchString, highlightClass);
    }
  }

  public static highlightMany(
    targetString: string,
    searchStrings: string[] = [],
    highlightClasses: string[],
    type: "fuzzy" | "exact" = "fuzzy"
  ) {
    const positions: HighlightPosition[] = [];
    const cleanTarget = FilterService.htmlSafe(targetString.toString());

    // First collect all positions that need highlighting
    for (let i = 0; i < searchStrings.length; i++) {
      const str = searchStrings[i];
      if (!str || typeof str !== 'string' || !str.length) continue;

      const highlightClass = i >= highlightClasses.length
        ? highlightClasses[highlightClasses.length - 1]
        : highlightClasses[i];

      if (type === "exact") {
        const start = cleanTarget.toLowerCase().indexOf(str.toLowerCase());
        if (start !== -1) {
          positions.push({
            start,
            end: start + str.length,
            class: highlightClass
          });
        }
      } else {
        // For fuzzy matching, collect character positions
        const chars = str.toLowerCase().split('');
        let targetChars = cleanTarget.toLowerCase().split('');
        let currentPos = 0;

        chars.forEach(char => {
          const charPos = targetChars.indexOf(char, currentPos);
          if (charPos !== -1) {
            positions.push({
              start: charPos,
              end: charPos + 1,
              class: highlightClass
            });
            currentPos = charPos + 1;
          }
        });
      }
    }

    // Sort positions by start index and handle overlaps
    positions.sort((a, b) => a.start - b.start);
    const mergedPositions: HighlightPosition[] = [];

    for (const pos of positions) {
      if (mergedPositions.length === 0) {
        mergedPositions.push(pos);
        continue;
      }

      const last = mergedPositions[mergedPositions.length - 1];
      if (pos.start <= last.end) {
        // Merge overlapping highlights
        last.end = Math.max(last.end, pos.end);
      } else {
        mergedPositions.push(pos);
      }
    }

    // Apply all highlights at once
    let result = cleanTarget.split('');
    let offset = 0;

    mergedPositions.forEach(pos => {
      const spanOpen = `<span class="${pos.class}">`;
      const spanClose = "</span>";

      result.splice(pos.start + offset, 0, spanOpen);
      offset += 1;
      result.splice(pos.end + offset, 0, spanClose);
      offset += 1;
    });

    return result.join('');
  }

  public static fuzzyMatch(targetString: string, searchString: string) {
    if (!targetString || !searchString) return false;
    const target = targetString?.toLowerCase()?.split('');
    const search = searchString?.toLowerCase()?.split('');

    return search?.every((char) => {
      return target?.includes(char);
    });
  }

}