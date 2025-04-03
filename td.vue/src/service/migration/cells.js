// Mock migration cells file
// The original file was archived to /archive/completed-migrations/vue3-migration/src/migration/
// This is a stub to allow tests to pass

const map = jest.fn().mockReturnValue({
    nodes: [],
    edges: []
});

export default {
    map
};
